import { RoomCard } from '@/components/room-card';
import { RoomListSkeleton } from '@/components/room-list-skeleton';
import { buttonVariants } from '@/components/ui/button';
import { db } from '@/db';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';

const RoomsPage = async () => {
  const rooms = await db.room.findMany({
    include: {
      type: true,
    },
  });

  return (
    <div className='container mx-auto px-4 py-12 min-h-screen'>
      <div className='flex justify-between items-center mb-10'>
        <h1 className='text-3xl font-semibold'>Rooms</h1>
        <Link href='/rooms/create' className={cn(buttonVariants())}>
          <h1 className='text-center animate-fade-in font-semibold animate hover:zoom-in-105'>
            Create
          </h1>
          <ArrowRight className='w-4 h-4' />
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className='text-center animate-fade-in mt-20 text-muted-foreground'>
          No rooms available at the moment. Please check back later.
        </div>
      ) : (
        <Suspense fallback={<RoomListSkeleton />}>
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fade-in'>
            {rooms.map((room, index) => (
              <div
                key={room.id}
                className='animate-fade-in'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default RoomsPage;
