'use server';

import { db } from '@/db';
import { getAvailableRooms } from '@/lib/transactions';
import { CreateTransactionSchema } from '@/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const getTransactionById = async (id: string) => {
  const transaction = await db.transaction.findUnique({
    where: { id },
    include: {
      guest: true,
      room: {
        include: {
          type: true,
        },
      },
      bill: true,
    },
  });

  return transaction;
};

export const checkOutTransaction = async (id: string) => {
  const transaction = await db.transaction.findUnique({
    where: { id },
    include: { room: true },
  });

  if (!transaction) {
    return { success: false, message: 'Transaction not found' };
  }

  if (transaction.status === 'COMPLETED') {
    return { success: false, message: 'Transaction already completed' };
  }

  const roomType = await db.roomType.findUnique({
    where: { id: transaction.room.roomTypeId },
  });

  const hours = Math.ceil(
    (new Date().getTime() - transaction.checkIn.getTime()) / (1000 * 60 * 60)
  );
  const totalPrice = ((roomType?.price ?? 0) / 24) * hours;

  await db.transaction.update({
    where: { id },
    data: { status: 'COMPLETED', checkOut: new Date(), totalPrice },
  });

  // TODO: Handling payment with stripe
  const bill = await db.bill.create({
    data: {
      totalAmount: totalPrice,
      transactionId: id,
      paymentStatus: 'PENDING',
    },
  });

  if (!bill) {
    return { success: false, message: 'Failed to create bill' };
  }

  revalidatePath('/transactions');
  return {
    success: true,
    message: `Transaction completed, please check bill for payment ${bill.id}`,
  };
};

export const deleteTransaction = async (id: string) => {
  const transaction = await db.transaction.findUnique({
    where: { id },
  });

  if (!transaction) {
    return { success: false, message: 'Transaction not found' };
  }

  if (transaction.status === 'COMPLETED' || transaction.status == 'CHECKIN') {
    return { success: false, message: 'Transaction has been in progess' };
  }

  await db.transaction.delete({
    where: { id },
  });

  revalidatePath('/transactions');
  return { success: true, message: 'Transaction deleted' };
};

export const checkInTransaction = async (id: string) => {
  const transaction = await db.transaction.findUnique({
    where: { id },
  });

  if (!transaction) {
    return { success: false, message: 'Transaction not found' };
  }

  if (transaction.status === 'COMPLETED') {
    return { success: false, message: 'Transaction already completed' };
  }

  await db.transaction.update({
    where: { id },
    data: { status: 'CHECKIN', checkIn: new Date() },
  });

  revalidatePath('/transactions');
  return { success: true, message: 'Transaction checked in' };
};

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

    if (new Date(checkIn) >= new Date(checkOut)) {
      return {
        success: false,
        message: 'Check in date must be before check out date',
      };
    }

    const rooms = await getAvailableRooms(checkIn, checkOut);

    const room = rooms.find((r) => r.id === roomId);

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

export const getPendingTransactions = () => {
  return db.transaction.findMany({
    where: {
      status: 'PEDNING',
    },
  });
};
