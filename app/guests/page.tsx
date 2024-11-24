import { GuestList } from '@/components/guest-list';
import Loading from '@/components/loading';
import { buttonVariants } from '@/components/ui/button';
import { db } from '@/db';
import { cn } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import React, { Suspense } from 'react';

const GuestsPage = async () => {
  await auth.protect();

  const guests = await db.guest.findMany();

  return (
    <div className='container mx-auto py-10'>
      <div className='flex gap-2'>
        <h1 className='text-3xl font-bold mb-8'>Guest Management</h1>
        <Link
          href='/guests/create'
          className={cn(
            buttonVariants({ variant: 'default' }),
            'bg-gradient-to-r from-cyan-500 to-blue-500'
          )}
        >
          Create
          <ArrowRightIcon className='w-4 h-4' />
        </Link>
      </div>
      <Suspense fallback={<Loading />}>
        <GuestList guests={guests} />
      </Suspense>
    </div>
  );
};

export default GuestsPage;
