'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { POSITION, updateStaffSchema } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

const StaffEdit = ({ params }: { params: { id: string } }) => {
  const user = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof updateStaffSchema>>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      role: 'org:member',
      position: POSITION.DEFAULT,
    },
  });

  useEffect(() => {
    axios.get(`/api/staffs/${params.id}`).then((res) => {
      if (res.status === 200) {
        form.reset(res.data);
        toast.success('Employee data loaded successfully!');
      }
    });
  }, []);

  async function onSubmit(values: z.infer<typeof updateStaffSchema>) {
    setIsLoading(true);

    const res = await axios.put(`/api/staffs/${params.id}`, values);

    if (res.status === 200) {
      toast.success('Employee updated successfully!');
      router.refresh();
      router.push('/staffs');
    } else {
      router.refresh();
      toast.error('Failed to update employee');
    }

    setIsLoading(false);
  }

  if (!user.orgRole?.includes('org:admin')) {
    return (
      <div className='container mx-auto py-10 max-w-3xl'>
        <Card>
          <CardHeader>
            <CardTitle>Unauthorized Access</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-lg'>
              You do not have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!params.id) return null;

  return (
    <div className='container mx-auto py-10 max-w-3xl'>
      <Link
        href='/staffs'
        className='inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6'
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Staff List
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Edit Employee</CardTitle>
          <CardDescription>
            Update the information for employee ID: {params.id}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='personal' className='w-full'>
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='personal'>Personal Info</TabsTrigger>
              <TabsTrigger value='work'>Work Info</TabsTrigger>
            </TabsList>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8 mt-8'
              >
                <TabsContent value='personal'>
                  <div className='grid gap-6 md:grid-cols-2 space-y-2'>
                    <FormField
                      control={form.control}
                      name='firstName'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input type='password' {...field} />
                        </FormControl>
                        <FormDescription>
                          Leave blank to keep current password
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value='work' className='space-y-2'>
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
                            {Object.values(POSITION)
                              .filter((position) => position !== '')
                              .map((position) => (
                                <SelectItem key={position} value={position}>
                                  {position}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <div className='flex justify-end space-x-4'>
                  <Button variant='outline' onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type='submit' disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Updating...
                      </>
                    ) : (
                      'Update Employee'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffEdit;
