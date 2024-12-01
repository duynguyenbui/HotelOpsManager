import { Suspense } from 'react';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { RoomOccupancyCard } from '@/components/dashboard/room-occupancy-card';
import { RevenueCard } from '@/components/dashboard/revenue-card';
import { GuestStatisticsCard } from '@/components/dashboard/guest-statistics-card';
import { RecentTransactionsCard } from '@/components/dashboard/recent-transactions-card';
import { UpcomingCheckInsCard } from '@/components/dashboard/upcoming-check-ins-card';
import { RoomTypeDistributionCard } from '@/components/dashboard/room-type-distribution-card';
import { getRoomTypeDistribution } from '@/actions/dashboard';
import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  await auth.protect();
  const roomTypeData = await getRoomTypeDistribution();

  return (
    <DashboardShell className='p-4'>
      <DashboardHeader
        heading='Dashboard'
        text='Welcome to your hotel management dashboard.'
      />
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Suspense fallback={<div className='h-24 rounded-md bg-muted' />}>
          <RoomOccupancyCard />
        </Suspense>
        <Suspense fallback={<div className='h-24 rounded-md bg-muted' />}>
          <RevenueCard />
        </Suspense>
        <Suspense fallback={<div className='h-24 rounded-md bg-muted' />}>
          <GuestStatisticsCard />
        </Suspense>
        <Suspense fallback={<div className='h-24 rounded-md bg-muted' />}>
          <UpcomingCheckInsCard />
        </Suspense>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <Suspense
          fallback={
            <div className='h-[400px] rounded-md bg-muted lg:col-span-4' />
          }
        >
          <RecentTransactionsCard />
        </Suspense>
        <Suspense
          fallback={
            <div className='h-[400px] rounded-md bg-muted lg:col-span-3' />
          }
        >
          <RoomTypeDistributionCard data={roomTypeData} />
        </Suspense>
      </div>
    </DashboardShell>
  );
}
