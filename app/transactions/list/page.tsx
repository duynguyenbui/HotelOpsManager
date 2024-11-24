import TransactionList from '@/components/transactions-list';
import { db } from '@/db';
import { TransactionsWithGuestAndRoom } from '@/types';
import React from 'react';

const BookingListPage = async () => {
  const transactions: TransactionsWithGuestAndRoom[] =
    await db.transaction.findMany({
      include: {
        guest: true,
        room: true,
      },
      orderBy: {
        checkIn: 'desc',
      },
    });

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Transactions List</h1>
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default BookingListPage;
