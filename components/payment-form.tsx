'use client';

import { useState } from 'react';
import { Bill } from '@prisma/client';
import { processPayment } from '@/actions/payment';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const PaymentForm = ({ bill }: { bill: Bill }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await processPayment(bill.id, paymentMethod);
      alert('Payment processed successfully!');
      // Redirect or update UI as needed
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              className='block text-sm font-medium text-gray-700 mb-2'
              htmlFor='paymentMethod'
            >
              Payment Method
            </label>
            <Select
              onValueChange={setPaymentMethod}
              defaultValue={paymentMethod}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select payment method' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='credit_card'>Credit Card</SelectItem>
                <SelectItem value='debit_card'>Debit Card</SelectItem>
                <SelectItem value='paypal'>PayPal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type='submit' className='w-full'>
          Process Payment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentForm;
