'use server';

import { db } from '@/db';
import { RoomTypeSchema } from '@/types';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export const updateRoomType = async (data: RoomTypeSchema & { id: string }) => {
  const { orgRole } = await auth();

  if (orgRole !== 'org:admin') {
    return { success: false, message: 'Unauthorized' };
  }

  const { id, name, description, amenities, capacity, price } = data;

  if (!name || !description || !amenities || !capacity || !price) {
    return { success: false, error: 'No data provided' };
  }

  try {
    await db.roomType.update({
      where: { id },
      data: data,
    });

    revalidatePath(`/roomtypes/${id}`);
    return { success: true, message: 'Room type updated' };
  } catch (error) {
    return { success: false, error: 'Failed to update room type' };
  }
};

export const getAllRoomTypes = async () => {
  const roomTypes = await db.roomType.findMany({
    orderBy: {
      updatedAt: 'desc',
    },
  });

  if (!roomTypes || roomTypes.length === 0) {
    return [];
  }

  return roomTypes;
};

export const createRoomType = async (data: RoomTypeSchema) => {
  try {
    const { orgRole } = await auth();

    if (orgRole !== 'org:admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const { name, description, amenities, capacity, price } = data;

    if (!name || !description || !amenities || !capacity || !price) {
      return { success: false, message: 'No data provided' };
    }

    const roomType = await db.roomType.create({
      data: {
        name,
        description,
        amenities,
        capacity,
        price,
      },
    });

    revalidatePath('/roomtypes');

    return { success: true, roomType };
  } catch (error) {
    console.error('Failed to create room type:', error);
    return { success: false, message: 'Failed to create room type' };
  }
};
