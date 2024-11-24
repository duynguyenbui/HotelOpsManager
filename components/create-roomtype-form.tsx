'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Plus, X } from 'lucide-react';
import { roomeTypeSchema, RoomTypeSchema } from '@/types';
import { createRoomType } from '@/actions/room-types';

export function CreateRoomTypeForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');

  const form = useForm<RoomTypeSchema>({
    resolver: zodResolver(roomeTypeSchema),
    defaultValues: {
      amenities: [],
      capacity: 1,
      price: 0,
    },
  });

  const { setValue, watch } = form;
  const currentAmenities = watch('amenities');

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setValue('amenities', [...currentAmenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const removeAmenity = (index: number) => {
    setValue(
      'amenities',
      currentAmenities.filter((_, i) => i !== index)
    );
  };

  async function onSubmit(data: RoomTypeSchema) {
    setIsLoading(true);
    try {
      const res = await createRoomType(data);

      if (res.success) {
        toast.success('Room type created successfully');
        router.push('/roomtypes');
        router.refresh();
      }

      if (!res.success) {
        toast.error('Failed to create room type');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to create room type');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className='pt-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type Name</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g., Deluxe Suite' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Describe the room type...'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='capacity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Day</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
                        step={0.01}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='amenities'
              render={() => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <div className='space-y-4'>
                    <div className='flex gap-2'>
                      <Input
                        value={newAmenity}
                        onChange={(e) => setNewAmenity(e.target.value)}
                        placeholder='Add an amenity...'
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addAmenity();
                          }
                        }}
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={addAmenity}
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                      {currentAmenities.map((amenity, index) => (
                        <div
                          key={index}
                          className='flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md'
                        >
                          <span>{amenity}</span>
                          <button
                            type='button'
                            onClick={() => removeAmenity(index)}
                            className='text-secondary-foreground/50 hover:text-secondary-foreground transition-colors'
                          >
                            <X className='h-4 w-4' />
                          </button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type='submit' disabled={isLoading} className='w-full'>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Create Room Type
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
