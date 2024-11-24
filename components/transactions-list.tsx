'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, BedDoubleIcon, UserIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { getStatusColor } from '@/lib/helper';
import { TransactionsWithGuestAndRoom } from '@/types';
import Link from 'next/link';

export type TransactionListProps = {
  transactions: TransactionsWithGuestAndRoom[];
};

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  return (
    <div className='space-y-6'>
      {transactions.length === 0 && (
        <div className='text-center text-muted-foreground'>
          No transactions found.
        </div>
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3'>
        {transactions.map((transaction) => (
          <Card key={transaction.id} className='w-full'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-semibold'>
                Transaction #{transaction.id.slice(0, 8)}
              </CardTitle>
              <Badge className={getStatusColor(transaction.status)}>
                {transaction.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 gap-4'>
                <div className='flex items-center space-x-2'>
                  <UserIcon className='h-4 w-4 opacity-70' />
                  <span className='text-sm font-medium'>
                    {transaction.guest.firstName} {transaction.guest.lastName}
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <BedDoubleIcon className='h-4 w-4 opacity-70' />
                  <span className='text-sm font-medium'>
                    Room {transaction.room.roomNumber}
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <CalendarIcon className='h-4 w-4 opacity-70' />
                  <span className='text-sm'>
                    Check-in:{' '}
                    {format(new Date(transaction.checkIn), 'MMM dd, yyyy p')}
                  </span>
                </div>
                <div className='flex items-center space-x-2'>
                  <CalendarIcon className='h-4 w-4 opacity-70' />
                  <span className='text-sm'>
                    Check-out:{' '}
                    {format(new Date(transaction.checkOut), 'MMM dd, yyyy p')}
                  </span>
                </div>

                <div className='mt-4'>
                  <div className='flex items-center space-x-2'>
                    <Clock className='h-4 w-4 opacity-70' />
                    <Badge className='text-sm'>{transaction.status}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/transactions/${transaction.id}/checkout`}>
                <div className='flex items-center justify-between space-x-2'>
                  <span className='text-sm font-semibold'>
                    Total: ${transaction.totalPrice.toFixed(2)}
                  </span>
                  <Badge
                    className='transform transition-transform duration-200 hover:scale-125'
                    variant='outline'
                  >
                    Checkout
                  </Badge>
                </div>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
