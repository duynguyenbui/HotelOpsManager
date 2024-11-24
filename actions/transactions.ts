'use server';

import { db } from '@/db';
import { CreateTransactionSchema } from '@/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const createTransaction = async (data: CreateTransactionSchema) => {
  try {
    const { checkIn, checkOut, totalPrice, roomId, guestId, staffId } = data;

    if (
      !checkIn ||
      !checkOut ||
      !totalPrice ||
      !roomId ||
      !guestId ||
      !staffId
    ) {
      return { success: false, message: 'Data is required' };
    }

    console.log(data);
    if (new Date(checkIn) >= new Date(checkOut)) {
      return {
        success: false,
        message: 'Check in date must be before check out date',
      };
    }

    const room = await db.room.findUnique({ where: { id: roomId } });

    if (!room) {
      return { success: false, message: 'Room not found' };
    }

    if (room.status !== 'READY') {
      return { success: false, message: 'Room is not available' };
    }

    const transaction = await db.transaction.create({
      data: {
        guestId: data.guestId,
        roomId: data.roomId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        totalPrice: data.totalPrice,
        staffId: data.staffId,
      },
    });

    // Update room status if applicable

    revalidatePath('/transactions');
    return { success: true, data: transaction, message: 'Transaction created' };
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors };
    }
    if (error instanceof Error) {
      return { success: false, message: error.message };
    }
    return { success: false, message: 'An unexpected error occurred' };
  }
};
