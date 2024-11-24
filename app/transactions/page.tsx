import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { RoomAvailability } from '@/components/room-availability';

const TransactionsPage = async () => {
  await auth.protect();

  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  return (
    <div className='w-full'>
      <RoomAvailability />
    </div>
  );
};

export default TransactionsPage;
