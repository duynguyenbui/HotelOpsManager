import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { buttonVariants } from '@/components/ui/button';
import { CogIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { RoomAvailability } from '@/components/room-availability';

const TransactionsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  return (
    <div className='w-full'>
      <div className='flex space-x-2 justify-between p-4 ml-28 mr-20'>
        <h1 className='text-2xl font-bold mb-4'>Transactions Management</h1>
        <Link
          href='/transactions/list'
          className={cn(
            buttonVariants({
              variant: 'secondary',
            }),
            ''
          )}
        >
          List
          <CogIcon className='w-4 h-4 ml-2' />
        </Link>
      </div>
      <RoomAvailability />
    </div>
  );
};

export default TransactionsPage;
