import { create } from 'zustand';

interface TransactionModalStore {
  isOpen: boolean;
  data: {
    startDate?: Date;
    endDate?: Date;
  } | null;
  onOpen: (data: { startDate?: Date; endDate?: Date }) => void;
  onClose: () => void;
}

export const useTransactionModal = create<TransactionModalStore>((set) => ({
  isOpen: false,
  data: null,
  onOpen: (data) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false, data: null }),
}));
