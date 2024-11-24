import { CreateRoomForm } from '@/components/create-room-form';

export default function CreateRoomPage() {
  return (
    <div className='container mx-auto px-4 py-8 lg:w-[900px]'>
      <h1 className='text-3xl font-bold mb-6'>Create New Room</h1>
      <CreateRoomForm />
    </div>
  );
}
