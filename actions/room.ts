'use server';

import { db } from '@/db';
import { RoomSchema } from '@/types';
import { revalidatePath } from 'next/cache';

export const createRoom = async (data: RoomSchema) => {
  try {
    const { roomNumber, floor, status, imageUrls, roomTypeId } = data;

    if (!roomNumber || !floor || !status || !imageUrls || !roomTypeId) {
      return { success: false, message: 'No data provided' };
    }

    const room = await db.room.create({
      data: {
        roomNumber,
        floor,
        status,
        imageUrls,
        roomTypeId,
        dateEffective: new Date(),
      },
    });
    revalidatePath('/rooms');

    return { success: true, room };
  } catch (error) {
    console.error('Failed to create room:', error);
    return { success: false, message: 'Failed to create room' };
  }
};

export const updateRoom = async (id: string, data: RoomSchema) => {
  try {
    if (!id || !data) {
      return { success: false, message: 'No data provided' };
    }

    const transactions = await db.transaction.findMany({
      where: {
        roomId: id,
        OR: [
          {
            status: 'PEDNING',
          },
          {
            status: 'CHECKIN',
          },
        ],
      },
    });

    if (transactions.length > 0) {
      return {
        success: false,
        message: 'Cannot update room with active transactions',
      };
    }

    await db.room.update({
      where: { id },
      data: {
        roomNumber: data.roomNumber,
        floor: data.floor,
        status: data.status,
        imageUrls: data.imageUrls,
        roomTypeId: data.roomTypeId,
      },
    });

    revalidatePath('/rooms');

    return { success: true, message: 'Room updated' };
  } catch (error) {
    console.error('Failed to update room:', error);
    return { success: false, message: 'Failed to update room' };
  }
};
