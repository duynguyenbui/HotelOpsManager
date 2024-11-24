'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Mail, Briefcase, Shield, Trash2, Edit } from 'lucide-react';
import { User } from '@/types';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useStaffModal } from '@/hooks/use-staff-modal';

export const UserCard = ({ user }: { user: User }) => {
  const auth = useAuth();
  const { onOpen } = useStaffModal();

  const fullName =
    user.firstName && user.lastName
      ? `${user.firstName}, ${user.lastName}`
      : user.id;

  return (
    <Card className='w-full max-w-md mx-auto transition-transform duration-300 hover:scale-105'>
      <CardHeader className='flex flex-col sm:flex-row items-center gap-2 pb-2'>
        <Avatar className='h-20 w-20 sm:h-16 sm:w-16 border'>
          <AvatarImage src={user.imageUrl} alt={fullName} />
          <AvatarFallback>
            <AvatarImage src='/logo.svg' alt='FALLBACK' />
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col items-center sm:items-start'>
          <CardTitle className='text-xl font-semibold text-center sm:text-left'>
            {fullName}
          </CardTitle>
          <p className='text-sm text-muted-foreground'>
            {user.role.includes('org:admin') ? 'Administrator' : 'Member'}
          </p>
        </div>
      </CardHeader>
      <CardContent className='grid gap-4 pt-4'>
        <div className='grid grid-cols-[24px_1fr] items-center gap-2'>
          <Mail className='h-5 w-5 text-muted-foreground' />
          <span className='text-sm break-all'>{user.email || 'N/A'}</span>
        </div>
        <div className='grid grid-cols-[24px_1fr] items-center gap-2'>
          <Briefcase className='h-5 w-5 text-muted-foreground' />
          <span className='text-sm break-all'>{user.position || 'N/A'}</span>
        </div>
        <div className='grid grid-cols-[24px_1fr] items-center gap-2'>
          <Shield className='h-5 w-5 text-muted-foreground' />
          <span className='text-sm break-all'>
            {user.role === 'org:admin' ? 'Admin' : 'Member'}
          </span>
        </div>
      </CardContent>
      {auth.orgRole?.includes('org:admin') && (
        <CardFooter className='flex justify-end gap-2'>
          {auth.userId != user.id && !user.role?.includes('org:admin') && (
            <Button
              variant='destructive'
              size='sm'
              onClick={() => onOpen('delete', user)}
              className='flex items-center gap-2'
            >
              <Trash2 className='h-4 w-4' />
              Delete
            </Button>
          )}
          {!user.role?.includes('org:admin') && (
            <Link
              href={`/staffs/${user.id}/edit`}
              className={buttonVariants({ size: 'sm' })}
            >
              <Edit className='h-4 w-4' />
              Edit
            </Link>
          )}
        </CardFooter>
      )}
    </Card>
  );
};
