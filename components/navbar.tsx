'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import {
  Banknote,
  Building2,
  ClipboardList,
  Home,
  LogIn,
  Menu,
  TypeIcon as TypeOutline,
  UserCircle2,
  Users,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ModeToggle } from './mode-toggle';
import { useEffect, useState } from 'react';
import { getPendingTransactions } from '@/actions/transactions';
import { getBillingNotPaid } from '@/actions/payment';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Transactions', href: '/transactions', icon: ClipboardList },
  { name: 'Rooms', href: '/rooms', icon: Building2 },
  { name: 'Guests', href: '/guests', icon: Users },
  { name: 'Staffs', href: '/staffs', icon: UserCircle2 },
  { name: 'Room Types', href: '/roomtypes', icon: TypeOutline },
  { name: 'Payment', href: '/payment', icon: Banknote },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [transactionsPending, setTransactionsPending] = useState<number>(0);
  const [billingPending, setBillingPending] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const transactions = await getPendingTransactions();
      setTransactionsPending(transactions.length);

      const billing = await getBillingNotPaid();
      setBillingPending(billing.length);
    };

    fetchData();

    const intervalId = setInterval(fetchData, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className='border-b'>
      <div className='flex h-16 items-center px-4'>
        <Link href='/' className='mr-6 flex items-center space-x-2'>
          <Building2 className='h-6 w-6' />
          <span className='hidden font-bold sm:inline-block'>
            Hotel Ops Management
          </span>
        </Link>
        <div className='hidden md:flex md:items-center md:space-x-4'>
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname.includes(item.href) ? 'default' : 'ghost'}
              className='text-sm font-medium transition-colors hover:text-blue-600 relative'
              asChild
            >
              <Link href={item.href}>
                <item.icon className='mr-2 h-4 w-4' />
                {item.name}
                {(item.name === 'Transactions' && transactionsPending > 0) ||
                (item.name === 'Payment' && billingPending > 0) ? (
                  <span className='absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full'></span>
                ) : null}
              </Link>
            </Button>
          ))}
        </div>
        <div className='ml-auto flex items-center space-x-4'>
          <ModeToggle />
          {isSignedIn ? (
            <UserButton afterSignOutUrl='/' />
          ) : (
            <SignInButton mode='modal'>
              <Button variant='outline' size='sm'>
                <LogIn className='mr-2 h-4 w-4' />
                Log In
              </Button>
            </SignInButton>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='md:hidden'
                aria-label='Open Menu'
              >
                <Menu className='h-6 w-6' />
              </Button>
            </SheetTrigger>
            <SheetContent side='right'>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className='mt-4 flex flex-col space-y-2'>
                {navItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname.includes(item.href) ? 'default' : 'ghost'}
                    className='justify-start relative'
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className='mr-2 h-4 w-4' />
                      {item.name}
                      {(item.name === 'Transactions' &&
                        transactionsPending > 0) ||
                      (item.name === 'Payment' && billingPending > 0) ? (
                        <span className='absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full'></span>
                      ) : null}
                    </Link>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
