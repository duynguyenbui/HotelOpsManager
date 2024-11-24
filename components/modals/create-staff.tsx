'use client';

import { useForm } from 'react-hook-form';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useStaffModal } from '@/hooks/use-staff-modal';
import { z } from 'zod';
import { createdStaffSchema } from '@/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const CreateStaffModal = () => {
  const router = useRouter();
  const { type, isOpen, onClose } = useStaffModal();

  const form = useForm<z.infer<typeof createdStaffSchema>>({
    resolver: zodResolver(createdStaffSchema),
  });

  async function onSubmit(values: z.infer<typeof createdStaffSchema>) {
    if (
      !values.email ||
      !values.username ||
      !values.password ||
      !values.firstName ||
      !values.lastName ||
      !values.role ||
      !values.position
    ) {
      toast('Please fill in the required fields.');
      return;
    }

    try {
      const res = await axios.post('/api/staffs', values);

      if (res.status === 200) {
        toast('Staff member created successfully.');
      }
    } catch (error) {
      console.error(error);
      toast('Something went wrong when creating user.');
    } finally {
      form.reset();
      onClose();

      router.push('/');
    }
  }

  return (
    <Dialog open={isOpen && type === 'create'} onOpenChange={() => onClose()}>
      <DialogContent className='sm:max-w-[420px] rounded-sm'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type='email'
                      placeholder='johndoe@example.com'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='johndoe' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John' {...field} />
                  </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='org:admin'>Admin</SelectItem>
                      <SelectItem value='org:member'>Member</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='position'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a position' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='HOUSEKEEPING'>Housekeeping</SelectItem>
                      <SelectItem value='FRONT_DESK'>Front Desk</SelectItem>
                      <SelectItem value='MAINTENANCE'>Maintenance</SelectItem>
                      <SelectItem value='MANAGEMENT'>Management</SelectItem>
                      <SelectItem value='BELLHOP'>Bellhop</SelectItem>
                      <SelectItem value='FOOD_AND_BEVERAGE'>
                        Food and Beverage
                      </SelectItem>
                      <SelectItem value='CHEF'>Chef</SelectItem>
                      <SelectItem value='SECURITY'>Security</SelectItem>
                      <SelectItem value='EVENT_PLANNING'>
                        Event Planning
                      </SelectItem>
                      <SelectItem value='VALET'>Valet</SelectItem>
                      <SelectItem value='LAUNDRY'>Laundry</SelectItem>
                      <SelectItem value='GUEST_RELATIONS'>
                        Guest Relations
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full'>
              Add Staff Member
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
