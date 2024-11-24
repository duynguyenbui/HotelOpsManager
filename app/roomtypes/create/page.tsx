import { CreateRoomTypeForm } from '@/components/create-roomtype-form';
import React from 'react';

const CreateRoomTypesPage = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Create Room Type</h1>
        <CreateRoomTypeForm />
      </div>
    </div>
  );
};

export default CreateRoomTypesPage;
