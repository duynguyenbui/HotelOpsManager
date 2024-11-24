import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { BugIcon, UsersIcon } from 'lucide-react';
import { UserCard } from '@/components/user-card';
import { POSITION, User } from '@/types';
import { CreateStaffButton } from '@/components/create-staff-button';
import { ORGANIZATION_ID } from '@/constants';

const StaffsPage = async () => {
  await auth.protect();

  const client = await clerkClient();
  const { userId, orgRole, orgId } = await auth();

  if (!userId) {
    redirect('/');
  }

  if (!orgRole || !orgRole.includes('admin')) {
    return (
      <div className='flex items-center justify-center flex-col h-screen'>
        <BugIcon className='w-20 h-20 text-red-300' />
        <p className='text-xl font-semibold text-center'>
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  if (!orgId) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-xl font-semibold'>No organization found.</p>
      </div>
    );
  }

  const [users, members] = await Promise.all([
    await client.users.getUserList({
      organizationId: [ORGANIZATION_ID],
    }),
    await client.organizations.getOrganizationMembershipList({
      organizationId: ORGANIZATION_ID,
    }),
  ]);

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-3xl font-bold mb-6 flex items-center p-1 ml-2'>
        <UsersIcon className='w-6 h-6 mr-2' />
        Staff Management
        <CreateStaffButton />
      </h1>
      <div className='grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
        {users.totalCount > 0 &&
          users.data.map((user) => {
            const organizationUser = members.data.find(
              (member) => member.publicUserData?.userId == user.id
            );

            const userInfo: User = {
              id: user.id!,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.hasImage ? user.imageUrl : '/logo.svg',
              email: user.emailAddresses[0]?.emailAddress || '',
              position: user.publicMetadata?.position as POSITION,
              role: organizationUser?.role as 'org:admin' | 'org:member',
              orgId: organizationUser?.id || '',
            };

            return <UserCard key={user.id} user={userInfo!} />;
          })}
      </div>
    </div>
  );
};

export default StaffsPage;
