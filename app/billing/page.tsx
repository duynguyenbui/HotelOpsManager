import { auth } from '@clerk/nextjs/server';
import React from 'react';

const BillingPage = async () => {
  await auth.protect();

  return <div>BillingPage</div>;
};

export default BillingPage;
