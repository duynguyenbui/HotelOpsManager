'use server';

import { db } from '@/db';

export async function getRoomOccupancy() {
  const totalRooms = await db.room.count();
  const occupiedRooms = await db.room.count({
    where: {
      status: 'READY',
      transactions: {
        some: {
          status: 'CHECKIN',
        },
      },
    },
  });
  const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

  return { occupiedRooms, totalRooms, occupancyRate };
}

export async function getDailyRevenue() {
  const today = new Date();
  const startOfToday = new Date(today.setHours(0, 0, 0, 0));
  const endOfToday = new Date();

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const startOfYesterday = new Date(yesterday.setHours(0, 0, 0, 0));
  const endOfYesterday = new Date(yesterday.setHours(23, 59, 59, 999));

  const todayRevenue = await db.bill.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      paymentDate: {
        gte: startOfToday,
        lt: endOfToday,
      },
      paymentStatus: 'PAID',
    },
  });

  const yesterdayRevenue = await db.bill.aggregate({
    _sum: {
      totalAmount: true,
    },
    where: {
      paymentDate: {
        gte: startOfYesterday,
        lte: endOfYesterday,
      },
      paymentStatus: 'PAID',
    },
  });

  const dailyRevenue = todayRevenue._sum.totalAmount || 0;
  const yesterdayRevenueValue = yesterdayRevenue._sum.totalAmount || 0;

  const comparedToYesterday =
    yesterdayRevenueValue !== 0
      ? Math.round(
          ((dailyRevenue - yesterdayRevenueValue) / yesterdayRevenueValue) * 100
        )
      : 100;

  return { dailyRevenue, comparedToYesterday };
}

export async function getGuestStatistics() {
  const totalGuests = await db.guest.count();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newGuestsToday = await db.guest.count({
    where: {
      createdAt: {
        gte: today,
      },
    },
  });

  return { totalGuests, newGuestsToday };
}

export async function getUpcomingCheckIns() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const upcomingCheckIns = await db.transaction.count({
    where: {
      checkIn: {
        gte: today,
        lt: tomorrow,
      },
      status: 'PEDNING',
    },
  });

  return { upcomingCheckIns };
}

export async function getRecentTransactions() {
  return db.transaction.findMany({
    take: 5,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      guest: true,
      room: true,
    },
  });
}

export async function getRoomTypeDistribution() {
  const roomTypes = await db.roomType.findMany({
    include: {
      _count: {
        select: { rooms: true },
      },
    },
  });

  return roomTypes.map((roomType) => ({
    name: roomType.name,
    value: roomType._count.rooms,
  }));
}
