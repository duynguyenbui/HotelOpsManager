import { auth } from '@clerk/nextjs/server';
import React from 'react';

const DashboardPage = async () => {
  await auth.protect();
  return <div>DashboardPage</div>;
};

export default DashboardPage;
