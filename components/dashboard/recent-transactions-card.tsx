import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getRecentTransactions } from '@/actions/dashboard';

export async function RecentTransactionsCard() {
  const transactions = await getRecentTransactions();

  return (
    <Card className='col-span-4'>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {transaction.guest.firstName} {transaction.guest.lastName}
                </TableCell>
                <TableCell>{transaction.room.roomNumber}</TableCell>
                <TableCell>
                  {new Date(transaction.checkIn).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(transaction.checkOut).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell className='text-right'>
                  ${transaction.totalPrice.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
