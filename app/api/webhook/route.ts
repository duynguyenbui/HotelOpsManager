import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { stripe } from '@/stripe';
import { db } from '@/db';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse('Webhook Error', { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    const bill = await db.bill.update({
      where: {
        id: session?.metadata?.billId,
      },
      data: {
        paymentStatus: 'PAID',
        paymentDate: new Date(),
      },
    });

    console.log('Payment cash out successfully');
    if (bill) {
      return new Response('Payment Processed successfully', { status: 200 });
    }
  }

  return new NextResponse('Webhook Error', { status: 400 });
}
