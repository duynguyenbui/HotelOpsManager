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
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { FileUpload } from './file-upload';

interface EditRoomFormProps {
  room: Room & { type: RoomType };
}

export function EditRoomForm({ room }: EditRoomFormProps) {
  const router = useRouter();
  const [editImage, setEditImage] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  const form = useForm<RoomSchema>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: room.roomNumber,
      floor: room.floor,
      status: room.status,
      imageUrl: room.imageUrl,
      roomTypeId: room.roomTypeId,
    },
  });

  async function changeImage(url: string) {
    setIsUploading(true);
    try {
      await form.setValue('imageUrl', url);
      setEditImage(false);
      toast.success('Image updated successfully');
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Failed to update image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    getAllRoomTypes()
      .then((types) => setRoomTypes(types))
      .catch((error) => {
        console.error(error);
        toast.error('Failed to fetch room types');
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

      toast.success('Room updated successfully');
      router.push('/rooms');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>Edit Room</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                name='roomTypeId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
            </div>
            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Image</FormLabel>
                  <FormControl>
                    <div className='relative w-full h-64 overflow-hidden rounded-lg'>
                      {!editImage ? (
                        <div className='relative w-full h-full group'>
                          <Image
                            src={field.value}
                            alt='Room Image'
                            layout='fill'
                            objectFit='cover'
                            className='transition-opacity group-hover:opacity-75'
                          />
                          <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                            <Button
                              type='button'
                              variant='secondary'
                              onClick={() => setEditImage(true)}
                            >
                              Change Image
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <FileUpload
                          onChange={changeImage}
                          endpoint={'hotelImage'}
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={isLoading || isUploading}
              className='w-full'
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Updating...
                </>
              ) : (
                'Update Room'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
