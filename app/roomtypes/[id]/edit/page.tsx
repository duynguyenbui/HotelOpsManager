import { EditRoomTypeForm } from '@/components/edit-roomtype-form';
import { db } from '@/db';
import { notFound } from 'next/navigation';

export default async function EditRoomTypePage({
  params,
}: {
  params: { id: string };
}) {
  const roomType = await db.roomType.findUnique({
    where: { id: params.id },
  });

  if (!roomType) {
    notFound();
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Edit Room Type</h1>
        <EditRoomTypeForm
          roomType={{ ...roomType, description: roomType.description ?? '' }}
          id={params.id}
        />
      </div>
    </div>
  );
}
