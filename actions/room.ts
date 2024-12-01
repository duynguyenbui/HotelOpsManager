'use server';

import { db } from '@/db';
import redis from '@/redis';
import { RoomSchema, RoomWithType } from '@/types';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export const getAllRooms = async () => {
  const cahcedRooms = await redis.get('rooms');

  if (cahcedRooms) {
    console.log('Returning cached rooms');
    return cahcedRooms as RoomWithType[];
  }

  const rooms = await db.room.findMany({
    include: {
      type: true,
    },
  });

  await redis.set('rooms', rooms, { ex: 500 });

  return rooms;
};

export const createRoom = async (data: RoomSchema) => {
  const { orgRole } = await auth();

  if (orgRole !== 'org:admin') {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const { roomNumber, floor, status, imageUrl, roomTypeId } = data;

    if (!roomNumber || !floor || !status || !imageUrl || !roomTypeId) {
      return { success: false, message: 'No data provided' };
    }

    const room = await db.room.create({
      data: {
        roomNumber,
        floor,
        status,
        imageUrl,
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
    const { orgRole } = await auth();

    if (orgRole !== 'org:admin') {
      return { success: false, message: 'Unauthorized' };
    }

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
        imageUrl: data.imageUrl,
        roomTypeId: data.roomTypeId,
      },
    });

    await redis.flushall();

    revalidatePath('/rooms');

    return { success: true, message: 'Room updated' };
  } catch (error) {
    console.error('Failed to update room:', error);
    return { success: false, message: 'Failed to update room' };
  }
};
