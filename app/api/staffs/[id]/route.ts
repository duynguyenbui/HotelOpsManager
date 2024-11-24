import { ORGANIZATION_ID } from '@/constants';
import { POSITION, UpdateStaffSchema } from '@/types';
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
        organizationId: ORGANIZATION_ID,
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

export async function PUT(req: Request) {
  try {
    const currentUser = await auth.protect();

    if (!currentUser.orgRole?.includes('org:admin')) {
      return Response.json({ status: 403 });
    }

    const {
      id,
      organizationId,
      username,
      role,
      firstName,
      lastName,
      position,
      password,
    }: UpdateStaffSchema = await req.json();

    if (
      !id ||
      !organizationId ||
      !username ||
      !role ||
      !firstName ||
      !lastName ||
      !position
    ) {
      return Response.json(null, { status: 400 });
    }

    const client = await clerkClient();

    const user = await client.users.getUser(id);

    const organization =
      await client.organizations.getOrganizationMembershipList({
        organizationId: ORGANIZATION_ID!,
      });

    const member = organization.data.find(
      (m) => m.publicUserData?.userId === id
    );

    if (member?.role?.includes('org:admin')) {
      return Response.json(null, { status: 403 });
    }

    if (!user) {
      return Response.json(null, { status: 404 });
    }

    const updatedUser = await client.users.updateUser(id, {
      username,
      publicMetadata: { position },
      firstName,
      lastName,
    });

    if (password) {
      await client.users.updateUser(id, {
        password: password,
      });
    }

    if (updatedUser) {
      revalidatePath('/staffs');
      return Response.json(null, { status: 200 });
    }
    
    return Response.json(null, { status: 500 });
  } catch (error) {
    console.error(error);
    return Response.json(null, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await auth.protect();

    if (!currentUser.orgRole?.includes('org:admin')) {
      return Response.json({ status: 403 });
    }

    const userId = params.id;

    if (!userId) {
      return Response.json(null, { status: 404 });
    }

    const client = await clerkClient();

    const [user, organizations] = await Promise.all([
      client.users.getUser(userId),
      client.organizations.getOrganizationMembershipList({
        organizationId: ORGANIZATION_ID!,
      }),
    ]);

    const organization = organizations.data.find(
      (org) => org.publicUserData?.userId === userId
    );

    const updateStaff: UpdateStaffSchema = {
      id: user.id,
      organizationId: ORGANIZATION_ID,
      username: user.username ?? '',
      role: organization?.role as 'org:admin' | 'org:member',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      position: user.publicMetadata?.position as POSITION,
    };

    if (!updateStaff) {
      return Response.json(null, { status: 404 });
    }

    return Response.json(updateStaff, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(null, { status: 500 });
  }
}
