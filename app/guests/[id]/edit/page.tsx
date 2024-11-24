import { getGuest } from '@/actions/guests';
import { EditGuestForm } from '@/components/edit-guest-form';
import { notFound } from 'next/navigation';

export default async function EditGuestPage({
  params,
}: {
  params: { id: string };
}) {
  const guest = await getGuest(params.id);

  if (!guest) {
    notFound();
  }

  return (
    <div className='max-w-2xl mx-auto py-8'>
      <EditGuestForm guest={guest} />
    </div>
  );
}
