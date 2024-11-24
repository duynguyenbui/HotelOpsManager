'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { createGuestSchema, CreateGuestSchema } from '@/types';
import { toast } from 'sonner';
import { createGuest } from '@/actions/guests';

export default function CreateGuestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateGuestSchema>({
    resolver: zodResolver(createGuestSchema),
  });

  async function onSubmit(data: CreateGuestSchema) {
    console.log(data);
    setIsSubmitting(true);
    const result = await createGuest(data);
    setIsSubmitting(false);

    if (result.success) {
      toast.success('Guest created successfully');
      router.push('/guests');
    } else {
      toast.error('Failed to create guest');
      if (result.errors) {
        result.errors.forEach((error) => {
          form.setError(error.path[0] as keyof CreateGuestSchema, {
            type: 'manual',
            message: error.message,
          });
        });
      }
    }
  }

  return (
    <Card className='w-full max-w-2xl mx-auto mt-20'>
      <CardHeader>
        <CardTitle>Create New Guest</CardTitle>
        <CardDescription>
          Enter the details of the new guest below.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='John' {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the first name of the guest.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Doe' {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the last name of the guest.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='john@doe.com' {...field} type='email' />
                  </FormControl>
                  <FormDescription>
                    This is the last name of the guest.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='phone'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder='1234567890' {...field} type='tel' />
                  </FormControl>
                  <FormDescription>
                    This is phone number of the guest.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder='New York' {...field} type='text' />
                  </FormControl>
                  <FormDescription>
                    This is the address of the guest.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='identityNo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identity Reference No</FormLabel>
                  <FormControl>
                    <Input placeholder='1234567890' {...field} type='text' />
                  </FormControl>
                  <FormDescription>
                    This is the identity reference number of the guest.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Guest'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
