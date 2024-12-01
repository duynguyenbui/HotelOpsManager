import { getTransactionById } from '@/actions/transactions';
import Loading from '@/components/loading';
import { auth } from '@clerk/nextjs/server';
import { format } from 'date-fns';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default async function TransactionIdPage({
  params,
}: {
  params: { id: string };
}) {
  await auth.protect();

  const transaction = await getTransactionById(params.id);

  if (!transaction) {
    return <Loading />;
  }

  return (
    <div className='container mx-auto p-4 space-y-6'>
      <h1 className='text-3xl font-bold'>Transaction #{transaction.id}</h1>
      <div className='grid md:grid-cols-2 gap-6'>
        <Card>
          <CardContent className='p-6 space-y-4'>
            <h2 className='text-xl font-semibold'>Room Information</h2>
            <div className='relative aspect-video w-full mb-4'>
              <Image
                src={transaction.room.imageUrl}
                alt={`Room ${transaction.room.roomNumber}`}
                layout='fill'
                objectFit='cover'
                className='rounded-lg'
              />
            </div>
            <InfoItem label='Room Number' value={transaction.room.roomNumber} />
            <InfoItem label='Type' value={transaction.room.type.name} />
            <InfoItem label='Floor' value={transaction.room.floor} />
            <InfoItem
              label='Status'
              value={<Badge>{transaction.room.status}</Badge>}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className='p-6 space-y-6'>
            <Section title='Guest Information'>
              <InfoItem
                label='Name'
                value={`${transaction.guest.firstName} ${transaction.guest.lastName}`}
              />
              <InfoItem label='Email' value={transaction.guest.email} />
              <InfoItem label='Phone' value={transaction.guest.phone} />
            </Section>

            <Separator />

            <Section title='Booking Details'>
              <InfoItem
                label='Check-in'
                value={format(transaction.checkIn, 'PPP')}
              />
              <InfoItem
                label='Check-out'
                value={format(transaction.checkOut, 'PPP')}
              />
              <InfoItem
                label='Total Price'
                value={`$${transaction.totalPrice.toFixed(2)}`}
              />
              <InfoItem
                label='Status'
                value={
                  <Badge variant={getStatusVariant(transaction.status)}>
                    {transaction.status}
                  </Badge>
                }
              />
            </Section>

            <Separator />

            <Section title='Additional Information'>
              <InfoItem
                label='Created'
                value={format(transaction.createdAt, 'PPP')}
              />
              <InfoItem
                label='Updated'
                value={format(transaction.updatedAt, 'PPP')}
              />
            </Section>

            {transaction.bill && (
              <>
                <Separator />
                <Section title='Bill Information'>
                  <InfoItem
                    label='Total Amount'
                    value={`$${transaction.bill.totalAmount.toFixed(2)}`}
                  />
                  <InfoItem
                    label='Paid Amount'
                    value={`$${transaction.bill.totalAmount.toFixed(2)}`}
                  />
                  <InfoItem
                    label='Payment Status'
                    value={<Badge>{transaction.bill.paymentStatus}</Badge>}
                  />
                </Section>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-2'>
      <h2 className='text-xl font-semibold'>{title}</h2>
      {children}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='flex justify-between'>
      <span className='text-muted-foreground'>{label}:</span>
      <span className='font-medium'>{value}</span>
    </div>
  );
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'PENDING':
      return 'outline';
    case 'CONFIRMED':
      return 'default';
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'default';
  }
}
