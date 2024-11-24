import { CreateTransactionData } from '../types/index';
import { create } from 'zustand';

interface useTransactionModalState {
  isOpen: boolean;
  onOpen: (data: CreateTransactionData | null) => void;
  onClose: () => void;
  data: CreateTransactionData | null;
}

export const useTransactionModal = create<useTransactionModalState>((set) => ({
  isOpen: false,
  data: null,
  onOpen: (data) => set({ isOpen: true, data: data }),
  onClose: () => set({ isOpen: false, data: null }),
}));
