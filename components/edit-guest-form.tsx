'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateGuest } from '@/actions/guests';
import { Guest } from '@prisma/client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Edit2, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';
import { UpdateGuestData } from '@/types';
import { FileUpload } from './file-upload';
import Image from 'next/image';

interface EditGuestFormProps {
  guest: Guest;
}

export function EditGuestForm({ guest }: EditGuestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      phone: guest.phone || '',
      address: guest.address || '',
      identityNo: guest.identityNo || '',
      imageUrl: guest.imageUrl || '',
    },
  });

  const changeImage = (url: string) => {
    setValue('imageUrl', url);
    setEditing(false);
  };

  const onSubmit = async (data: UpdateGuestData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const result = await updateGuest(guest.id, data);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'An error occurred');
    }

    setIsSubmitting(false);

    setTimeout(() => {
      router.push('/guests');
    }, 2000);
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>Edit Guest Information</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='firstName'>First Name</Label>
              <Input
                id='firstName'
                {...register('firstName', {
                  required: 'First name is required',
                })}
              />
              {errors.firstName && (
                <p className='text-sm text-destructive'>
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='lastName'>Last Name</Label>
              <Input
                id='lastName'
                {...register('lastName', { required: 'Last name is required' })}
              />
              {errors.lastName && (
                <p className='text-sm text-destructive'>
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              type='email'
              id='email'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Entered value does not match email format',
                },
              })}
            />
            {errors.email && (
              <p className='text-sm text-destructive'>{errors.email.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phone'>Phone</Label>
            <Input type='tel' id='phone' {...register('phone')} />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='address'>Address</Label>
            <Textarea id='address' {...register('address')} />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='identityNo'>Identity Number</Label>
            <Input id='identityNo' {...register('identityNo')} />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='imageUrl'>Image</Label>
            <div className='relative'>
              {getValues('imageUrl') && (
                <div className='relative w-full h-64 mb-4'>
                  <Image
                    src={getValues('imageUrl')}
                    alt='Guest'
                    layout='fill'
                    objectFit='cover'
                    className='rounded-md'
                  />
                </div>
              )}
              {editing ? (
                <div className='space-y-2'>
                  <FileUpload onChange={changeImage} endpoint={'hotelImage'} />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setEditing(false)}
                    className='mt-2'
                  >
                    <X className='mr-2 h-4 w-4' />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => setEditing(true)}
                >
                  <Edit2 className='mr-2 h-4 w-4' />
                  {getValues('imageUrl') ? 'Change Image' : 'Add Image'}
                </Button>
              )}
            </div>
          </div>

          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert
              variant='default'
              className='border-green-500 bg-green-50 text-green-700'
            >
              <CheckCircle2 className='h-4 w-4' />
              <AlertDescription>Guest updated successfully!</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type='submit' disabled={isSubmitting} className='w-full'>
            {isSubmitting ? 'Updating...' : 'Update Guest'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
