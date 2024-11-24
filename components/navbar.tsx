'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import {
  Building2,
  ClipboardList,
  Home,
  LogIn,
  Menu,
  TypeOutline,
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

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Transactions', href: '/transactions', icon: ClipboardList },
  { name: 'Rooms', href: '/rooms', icon: Building2 },
  { name: 'Guests', href: '/guests', icon: Users },
  { name: 'Staffs', href: '/staffs', icon: UserCircle2 },
  { name: 'Room Types', href: '/roomtypes', icon: TypeOutline },
];

export const Navbar = () => {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  console.log(pathname);

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
              className='text-sm font-medium transition-colors hover:text-blue-600'
              asChild
            >
              <Link href={item.href}>
                <item.icon className='mr-2 h-4 w-4' />
                {item.name}
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
                    className='justify-start'
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className='mr-2 h-4 w-4' />
                      {item.name}
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
