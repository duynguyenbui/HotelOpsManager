'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  CreateTransactionSchema,
  createTransactionSchema,
  RoomWithType,
} from '@/types';
import { useTransactionModal } from '@/hooks/use-transaction-modal';
import { useAuth } from '@clerk/nextjs';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { TimePicker } from '../ui/time-picker';
import { Guest } from '@prisma/client';
import { getAvailableRooms } from '@/lib/transactions';
import { getGuests } from '@/actions/guests';
import { createTransaction } from '@/actions/transactions';
import { useRouter } from 'next/navigation';

export const CreateTransactionModal = () => {
  const auth = useAuth();
  const router = useRouter();
  const { isOpen, onClose, data } = useTransactionModal();
  const [rooms, setRooms] = useState<RoomWithType[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof createTransactionSchema>>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      guestId: '',
      checkIn: data?.startDate,
      checkOut: data?.endDate,
      roomId: '',
      totalPrice: 0,
      staffId: auth.userId || '',
    },
  });

  const selectedRoomId = watch('roomId');
  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');

  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);

  useEffect(() => {
    if (checkIn && checkOut) {
      setIsLoading(true);
      getAvailableRooms(checkIn, checkOut).then((rooms) => {
        setRooms(rooms);
        setIsLoading(false);
      });
    }

    getGuests().then((guests) => {
      setGuests(guests);
    });
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (data) {
      setValue('checkIn', data.startDate!);
      setValue('checkOut', data.endDate!);
      setValue('staffId', auth.userId!);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (selectedRoom && checkIn && checkOut) {
      const hours = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
      );
      const totalPrice = (selectedRoom.type.price / 24) * hours;
      setValue('totalPrice', totalPrice);
    }
  }, [selectedRoom, checkIn, checkOut, setValue]);

  async function onSubmit(values: CreateTransactionSchema) {
    const { success, message } = await createTransaction(values);
    if (success) {
      toast.success(
        typeof message === 'string'
          ? message
          : 'Transaction created successfully'
      );
      onClose();
      return;
    }

    toast.error(
      typeof message === 'string' ? message : 'Failed to create transaction'
    );

    router.refresh();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[420px] md:max-w-[700px] rounded-sm'>
        <DialogTitle>Create Transactions</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='guestId'>Guest</Label>
              <Controller
                name='guestId'
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a guest' />
                    </SelectTrigger>
                    <SelectContent>
                      {guests.map((guest: Guest) => (
                        <SelectItem key={guest.id} value={guest.id}>
                          {guest.firstName} {guest.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.guestId && (
                <p className='text-red-500 text-sm'>{errors.guestId.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='roomId'>Room</Label>
              <Controller
                name='roomId'
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoading ? 'Loading rooms...' : 'Select a room'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((room: RoomWithType) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.roomNumber} - {room.type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.roomId && (
                <p className='text-red-500 text-sm'>{errors.roomId.message}</p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='checkIn'>Check-in Date</Label>
              <Controller
                name='checkIn'
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) =>
                          date < new Date() || date < new Date('1900-01-01')
                        }
                      />
                      <div className='p-3 border-t border-border'>
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='checkOut'>Check-out Date</Label>
              <Controller
                name='checkOut'
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) =>
                          date < new Date() || date < new Date('1900-01-01')
                        }
                      />
                      <div className='p-3 border-t border-border'>
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.checkOut && (
                <p className='text-red-500 text-sm'>
                  {errors.checkOut.message}
                </p>
              )}
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='totalPrice'>Total Price</Label>
              <Input
                type='number'
                step='0.01'
                {...register('totalPrice', { valueAsNumber: true })}
                readOnly
              />
              {errors.totalPrice && (
                <p className='text-red-500 text-sm'>
                  {errors.totalPrice.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='staffId'>Staff ID</Label>
              <Input type='text' {...register('staffId')} readOnly />
              {errors.staffId && (
                <p className='text-red-500 text-sm'>{errors.staffId.message}</p>
              )}
            </div>
          </div>

          <Button type='submit' className='w-full'>
            Create Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
