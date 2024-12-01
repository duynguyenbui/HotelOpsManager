'use server';

import { db } from '@/db';
import { stripe } from '@/stripe';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export const processPayment = async (
  id: string,
  paymentMethod: 'CASH' | 'CARD'
) => {
  const bill = await db.bill.findUnique({ where: { id } });

  if (!bill) {
    return { success: false, error: 'Bill not found' };
  }

  if (bill.paymentStatus !== 'PENDING') {
    return { success: false, error: 'Bill has already been paid' };
  }

  if (paymentMethod === 'CASH') {
    await db.bill.update({
      where: { id },
      data: {
        paymentStatus: 'PAID',
        paymentMethod: 'CASH',
        paymentDate: new Date(),
      },
    });
    revalidatePath('/payment');
    return {
      success: true,
      message: 'Payment processed successfully with CASH',
    };
  }

  if (paymentMethod === 'CARD') {
    await db.bill.update({
      where: { id },
      data: {
        paymentStatus: 'PENDING',
        paymentMethod: 'CARD',
        paymentDate: null,
      },
    });

    // Handle card payment with stripe
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'THB',
        product_data: {
          name: `Bill #${bill.id} ${bill.totalAmount}`,
        },
        unit_amount: Math.round(bill.totalAmount * 200),
      },
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_URL_PAYMENT_SUCCESS}`,
      cancel_url: `${process.env.NEXT_URL_PAYMENT_FAILED}`,
      metadata: {
        billId: bill.id,
      },
    });

    return { success: true, url: session.url, headers: corsHeaders };
  }
};

export async function getAllBills() {
  try {
    const bills = await db.bill.findMany({
      include: { transaction: true },
      orderBy: { billDate: 'desc' },
    });
    return bills;
  } catch (error) {
    console.error('Error fetching bills:', error);
    throw new Error('Failed to fetch bills');
  }
}

export const getBillingNotPaid = async () => {
  return await db.bill.findMany({
    where: {
      paymentStatus: 'PENDING',
    },
  });
};
