'use client';

import { useStaffModal } from '@/hooks/use-staff-modal';
import React from 'react';
import { Button } from './ui/button';
import { CreativeCommons } from 'lucide-react';

export const CreateStaffButton = () => {
  const { onOpen } = useStaffModal();
  return (
    <Button
      className='m-2 font-semibold'
      onClick={() => onOpen('create', null)}
    >
      Create
      <CreativeCommons className='w-4 h-4'/>
    </Button>
  );
};
