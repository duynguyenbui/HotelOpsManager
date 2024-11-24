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

export const getAllRooms = async () => {
  return [];
};
