import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b'>
      <main className='flex-grow flex flex-col items-center justify-center text-center px-4'>
        <h1 className='text-4xl font-bold mb-6'>
          Welcome to Hotel Ops Manager
        </h1>
        <p className='text-xl mb-8'>
          Streamline your hotel operations with our powerful management tool.
        </p>
        <SignedOut>
          <SignInButton mode='modal'>
            <Button size='lg'>Get Started</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link href='/dashboard'>
            <Button size='lg'>Go to Dashboard</Button>
          </Link>
        </SignedIn>
      </main>

      <footer className='text-center p-4 text-sm'>
        © 2023 Hotel Ops Manager. All rights reserved.
      </footer>
    </div>
  );
}
