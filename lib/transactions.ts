'use server';

import { db } from '@/db';
import { Transaction, TransactionStatus } from '@prisma/client';

export const findOverlappingTransactions = async (
  startDate: Date,
  endDate: Date,
  roomId?: string
): Promise<Transaction[]> => {
  if (startDate >= endDate) {
    return [];
  }

  const overlappingTransactions = await db.transaction.findMany({
    where: {
      status: {
        in: [TransactionStatus.PEDNING, TransactionStatus.CHECKIN],
      },
      OR: [
        {
          checkIn: {
            gte: startDate,
            lt: endDate,
          },
        },
        {
          checkOut: {
            gt: startDate,
            lte: endDate,
          },
        },
        {
          AND: [
            { checkIn: { lte: startDate } },
            { checkOut: { gte: endDate } },
          ],
        },
      ],
      roomId: roomId,
    },
    include: {
      room: {
        include: {
          type: true,
        },
      },
      guest: true,
    },
    orderBy: {
      checkIn: 'asc',
    },
  });

  return overlappingTransactions;
};

export const getAvailableRooms = async (startDate: Date, endDate: Date) => {
  const overlappingTransactions = await findOverlappingTransactions(
    startDate,
    endDate
  );

  const allRooms = await db.room.findMany({
    where: {
      status: 'READY',
    },
    include: {
      type: true,
    },
  });

  const bookedRoomIds = new Set(overlappingTransactions.map((t) => t.roomId));
  const availableRooms = allRooms.filter((room) => !bookedRoomIds.has(room.id));

  return availableRooms;
};
