import { User } from '../types/index';
import { create } from 'zustand';

interface useStaffModalState {
  isOpen: boolean;
  type: 'create' | 'delete' | null;
  onOpen: (type: 'create' | 'delete', data: User | null) => void;
  onClose: () => void;
  data: User | null;
}

export const useStaffModal = create<useStaffModalState>((set) => ({
  isOpen: false,
  type: null,
  data: null,
  onOpen: (type, data) => set({ isOpen: true, type, data: data }),
  onClose: () => set({ isOpen: false, type: null, data: null }),
}));
