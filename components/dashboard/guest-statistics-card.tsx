import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getGuestStatistics } from '@/actions/dashboard';

export async function GuestStatisticsCard() {
  const { totalGuests, newGuestsToday } = await getGuestStatistics();

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Guest Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{totalGuests}</div>
        <p className='text-xs text-muted-foreground'>
          {newGuestsToday} new guests today
        </p>
      </CardContent>
    </Card>
  );
}
