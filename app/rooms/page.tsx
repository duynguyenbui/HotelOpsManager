import { getAllRooms } from '@/actions/room';
import { RoomCard } from '@/components/room-card';
import { RoomListSkeleton } from '@/components/room-list-skeleton';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';

const RoomsPage = async () => {
  await auth.protect();
  const rooms = await getAllRooms();

  return (
    <div className='container mx-auto px-4 py-12 min-h-screen'>
      <div className='flex justify-between items-center mb-10'>
        <h1 className='text-3xl font-semibold'>Rooms</h1>
        <Link
          href='/rooms/create'
          className={cn(
            buttonVariants(),
            'bg-gradient-to-r from-cyan-500 to-blue-500 font-semibold'
          )}
        >
          Create
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
