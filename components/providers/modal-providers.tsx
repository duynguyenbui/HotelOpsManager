'use client';

import { useState, useEffect } from 'react';
import { CreateStaffModal } from '../modals/create-staff';
import { DeleteStaffModal } from '../modals/delete-staff';
import { CreateTransactionModal } from '../modals/create-transaction';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateStaffModal />
      <DeleteStaffModal />
      <CreateTransactionModal />
    </>
  );
};

export default ModalProvider;
