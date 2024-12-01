'use client';

import { Bill } from '@prisma/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { processPayment } from '@/actions/payment';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

interface BillListProps {
  bills: Bill[];
}

const BillList: React.FC<BillListProps> = ({ bills }) => {
  const handlePayment = (billId: string, method: 'CASH' | 'CARD') => {
    processPayment(billId, method).then((res) => {
      if (res?.success && method === 'CASH') {
        toast.success(res.message);
      }

      if (res?.success && method === 'CARD' && res.url) {
        window.location.href = res.url.toString();
      }

      if (res?.error) {
        toast.error(res.error);
      }
    });
  };

  const handleCancel = (billId: string) => {}

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {bills.map((bill) => (
        <Card key={bill.id}>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>Bill #{bill.id.slice(-6)}</span>
              <Link
                href={`/transactions/${bill.transactionId}`}
                className={cn('text-sm font-normal', 'hover:underline')}
              >
                View Transaction
                <ExternalLink className='w-4 h-4 inline-block ml-1' />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold'>${bill.totalAmount.toFixed(2)}</p>
            <p className='text-sm text-muted-foreground'>
              Status:{' '}
              <span className=' text-red-500 font-bold'>
                {bill.paymentStatus}
              </span>
            </p>
            <p className='text-sm text-muted-foreground'>
              Billing Date:{' '}
              <span className='font-medium'>
                {new Date(bill.billDate).toLocaleString()}
              </span>
            </p>
          </CardContent>
          <CardFooter className='flex gap-2'>
            {bill.paymentStatus === 'PENDING' ? (
              <>
                <Button
                  onClick={() => handlePayment(bill.id, 'CASH')}
                  className='flex-1'
                >
                  Pay with Cash
                </Button>
                <Button
                  onClick={() => handlePayment(bill.id, 'CARD')}
                  variant='secondary'
                  className='flex-1'
                >
                  Pay with Card
                </Button>
              </>
            ) : (
              <p className='text-green-600 font-semibold w-full text-center'>
                Paid
              </p>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BillList;
