'use server';

import { db } from '@/db';
import { CreateGuestSchema, UpdateGuestData } from '@/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const getGuest = async (id: string) => {
  return await db.guest.findUnique({
    where: { id },
  });
};

export async function createGuest(data: CreateGuestSchema) {
  try {
    const { firstName, lastName, email, identityNo, phone, address } = data;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !identityNo ||
      !phone ||
      !address
    ) {
      return { success: false, message: 'Invalid data' };
    }

    await db.guest.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        identityNo: data.identityNo,
      },
    });

    revalidatePath('/guests');

    return { success: true, message: 'Guest created successfully.' };
  } catch (error) {
    console.log(error);

    if (error instanceof z.ZodError) {
      return { success: false, message: 'Invalid data', errors: error.errors };
    }
    console.error('Error creating guest:', error);
    return {
      success: false,
      message: 'An error occurred while creating the guest.',
    };
  }
}

export const updateGuest = async (id: string, data: UpdateGuestData) => {
  try {
    const updatedGuest = await db.guest.update({
      where: { id },
      data,
    });

    revalidatePath('/guests');

    return { success: true, guest: updatedGuest, message: 'Guest updated' };
  } catch (error) {
    console.error('Failed to update guest:', error);
    return { success: false, error: 'Failed to update guest' };
  }
};
export const getGuests = () => {
  return db.guest.findMany();
};
