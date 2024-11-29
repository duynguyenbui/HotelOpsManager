import { auth } from '@clerk/nextjs/server';
import React from 'react';

const PaymentPage = async () => {
  await auth.protect();

  return <div>BillingPage</div>;
};

export default PaymentPage;
