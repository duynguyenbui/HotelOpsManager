import { RoomeTypeCard } from '@/components/roome-types';
import { Button, buttonVariants } from '@/components/ui/button';
import { db } from '@/db';
import { ArrowBigRightDash, TvIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const RoomTypesPage = async () => {
  const roomTypes = await db.roomType.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  if (roomTypes.length === 0) {
    return (
      <>
        <div className='text-center py-10 flex items-center justify-between p-5'>
          <div className='font-semibold text-3xl'>Room Types</div>
          <Button asChild className='mt-2 font-semibold'>
            <Link href='/roomtypes/create'>
              Create <ArrowBigRightDash className='w-4 h-4' />
              <TvIcon className='w-4 h-4' />
            </Link>
          </Button>
        </div>
        <div className='flex flex-col justify-center items-center'>
          <div className='text-xl text-muted-foreground'>
            No room types found.
          </div>
        </div>
      </>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Room Types</h1>
        <Link
          href='/roomtypes/create'
          className={buttonVariants({ variant: 'secondary' })}
        >
          Create
          <TvIcon className='w-4 h-4' />
        </Link>
      </div>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {roomTypes.map((roomType) => (
          <RoomeTypeCard key={roomType.id} roomType={roomType} />
        ))}
      </div>
    </div>
  );
};

export default RoomTypesPage;
