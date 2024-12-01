import { auth } from '@clerk/nextjs/server';
import { getAllBills } from '@/actions/payment';
import BillList from '@/components/bill-list';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileX2 } from 'lucide-react';
import Link from 'next/link';

const PaymentPage = async () => {
  await auth.protect();

  const bills = await getAllBills();

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Payments</h1>
      {bills.length === 0 ? (
        <Card className='w-full max-w-md mx-auto'>
          <CardHeader>
            <CardTitle className='flex items-center justify-center text-xl'>
              <FileX2 className='mr-2 h-6 w-6 text-muted-foreground' />
              No Bills Found
            </CardTitle>
            <CardDescription className='text-center'>
              You currently dont have any bills in the system.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex justify-center'>
            <Button asChild>
              <Link href='/learn-more'>Learn About Billing</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <BillList bills={bills} />
      )}
    </div>
  );
};

export default PaymentPage;
