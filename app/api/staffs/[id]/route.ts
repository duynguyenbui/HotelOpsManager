import { auth, clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await auth.protect();
    const { id } = params;

    if (!currentUser.orgRole?.includes('org:admin')) {
      return Response.json({ status: 401 });
    }

    const client = await clerkClient();
    const [user, orgMembers] = await Promise.all([
      client.users.getUser(id),
      client.organizations.getOrganizationMembershipList({
        organizationId: currentUser.orgId!,
      }),
    ]);

    const member = orgMembers.data.find((m) => m.publicUserData?.userId === id);

    if (!user || !member) {
      return Response.json(null, { status: 404 });
    }

    if (member.role === 'org:admin') {
      return Response.json(null, { status: 403 });
    }

    const res = await client.users.deleteUser(id);

    if (res) {
      revalidatePath('/staffs');
      return Response.json(null, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return Response.json(null, { status: 500 });
  }
}
