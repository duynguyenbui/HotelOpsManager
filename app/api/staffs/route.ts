import { ORGANIZATION_ID } from '@/constants';
import { clerkClient, auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  try {
    await auth.protect();

    const [client, currentUser] = await Promise.all([
      await clerkClient(),
      await auth(),
    ]);

    if (!currentUser.orgRole?.includes('org:admin')) {
      return Response.json(null, { status: 401 });
    }

    const { email, username, password, firstName, lastName, role, position } =
      await req.json();

    if (!email || !password || !firstName || !lastName || !role || !position) {
      return Response.json(null, { status: 400 });
    }

    // create user with Clerk
    const user = await client.users.createUser({
      emailAddress: [email],
      password: password,
      firstName: firstName,
      lastName: lastName,
      username: username,
      publicMetadata: {
        position: position,
      },
    });

    const organization =
      await client.organizations.createOrganizationMembership({
        organizationId: ORGANIZATION_ID!,
        userId: user.id,
        role: role,
      });

    if (organization && user) {
      return Response.json(null, { status: 200 });
    }

    return Response.json(null, { status: 500 });
  } catch (error: unknown) {
    console.error(error);

    return Response.json(null, { status: 500 });
  }
}
