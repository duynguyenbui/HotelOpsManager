'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';
import { Room, RoomStatus, RoomType } from '@prisma/client';
import { getAllRoomTypes } from '@/actions/room-types';
import { RoomSchema, roomSchema } from '@/types';
import { updateRoom } from '@/actions/room';

interface EditRoomFormProps {
  room: Room & { type: RoomType };
}

export function EditRoomForm({ room }: EditRoomFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  const form = useForm<RoomSchema>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: room.roomNumber,
      floor: room.floor,
      status: room.status,
      imageUrls: room.imageUrls,
      roomTypeId: room.roomTypeId,
    },
  });

  useEffect(() => {
    getAllRoomTypes()
      .then((types) => setRoomTypes(types))
      .catch((error) => {
        console.error(error);
        toast.error('Something went wrong when fetching room types');
      });
  }, []);

  async function onSubmit(data: RoomSchema) {
    setIsLoading(true);
    try {
      const res = await updateRoom(room.id, data);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success('Room updated', {
        description: 'The room has been successfully updated.',
      });
      router.push('/rooms');
    } catch (error) {
      console.error(error);
      toast.error('Error', {
        description: 'Failed to update room. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-4 shadow-sm p-4 border rounded-md'
      >
        <FormField
          control={form.control}
          name='roomNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='floor'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Floor</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select room status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(RoomStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='imageUrls'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URLs</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value?.join(', ')}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(',').map((url) => url.trim())
                    )
                  }
                  placeholder='Enter image URLs separated by commas'
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='roomTypeId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select room type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roomTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Room'}
        </Button>
      </form>
    </Form>
  );
}
