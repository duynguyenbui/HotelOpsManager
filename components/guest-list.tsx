import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Guest } from '@prisma/client';
import { buttonVariants } from './ui/button';
import Link from 'next/link';

export function GuestList({ guests }: { guests: Guest[] }) {
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Guest List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Information</TableHead>
              <TableHead>Identity</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.map((guest) => (
              <TableRow key={guest.id}>
                <TableCell>
                  <div className='font-medium'>
                    {guest.firstName}, {guest.lastName}
                  </div>
                  {guest.address && (
                    <div className='text-sm text-muted-foreground'>
                      {guest.address}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div>{guest.email}</div>
                  {guest.phone && (
                    <div className='text-sm text-muted-foreground'>
                      {guest.phone}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {guest.identityNo ? (
                    <Badge variant='outline'>{guest.identityNo}</Badge>
                  ) : (
                    <Badge variant='secondary'>Not Provided</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(guest.updatedAt), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className='space-x-2 space-y-1'>
                  <Link
                    href={`/guests/${guest.id}/edit`}
                    className={buttonVariants({
                      variant: 'link',
                    })}
                  >
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
