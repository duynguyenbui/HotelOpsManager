'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useStaffModal } from '@/hooks/use-staff-modal';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const DeleteStaffModal = () => {
  const router = useRouter();
  const { data, type, isOpen, onClose } = useStaffModal();

  async function onSubmit() {
    if (!data?.id) {
      toast('Staff member not found.');
      return;
    }

    const res = await axios.delete(`/api/staffs/${data.id}`);

    if (res.status === 200) {
      toast('Staff member deleted successfully.');
    } else {
      toast('Failed to delete staff member.');
    }

    onClose();

    router.push('/');
  }

  return (
    <Dialog open={isOpen && type === 'delete'} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Delete Staff</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this staff member pernamantly?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='sm:justify-start'>
          <Button type='button' variant='destructive' onClick={onSubmit}>
            Delete
          </Button>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
