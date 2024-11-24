'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  RoomWithType,
  CreateTransactionSchema,
  createTransactionSchema,
} from '@/types';
import { Guest } from '@prisma/client';
import { createTransaction } from '@/actions/transactions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { TimePicker } from './ui/time-picker';

export type TransactionFormProps = {
  rooms: RoomWithType[];
  staffId: string;
  guests: Guest[];
};

export const TransactionForm: React.FC<TransactionFormProps> = ({
  guests,
  rooms,
  staffId,
}) => {
  const router = useRouter();
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      staffId,
    },
  });

  const selectedRoomId = watch('roomId');
  const selectedRoom = rooms.find((room) => room.id === selectedRoomId);
  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');

  React.useEffect(() => {
    if (selectedRoom && checkIn && checkOut) {
      const hours = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
      );
      const totalPrice = (selectedRoom.type.price / 24) * hours;
      setValue('totalPrice', totalPrice);
    }
  }, [selectedRoom, checkIn, checkOut, setValue]);

  const onSubmit = async (data: CreateTransactionSchema) => {
    try {
      console.log(data);
      const res = await createTransaction(data);
      if (res.success) {
        toast.success('Transaction created successfully');
        router.push('/transactions/list');
      } else {
        toast.error('Failed to create transaction');
      }
      reset();
    } catch (e) {
      console.error('Error creating transaction:', e);
      toast.error('Failed to create transaction');
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto mt-20'>
      <CardHeader>
        <CardTitle>Create New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a room' />
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
      </CardContent>
    </Card>
  );
};
