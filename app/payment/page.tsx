import { auth } from '@clerk/nextjs/server';
import { getAllBills } from '@/actions/payment';
import BillList from '@/components/bill-list';

const PaymentPage = async () => {
  await auth.protect();

  const bills = await getAllBills();

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Bills</h1>
      <BillList bills={bills} />
    </div>
  );
};

export default PaymentPage;
