import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDailyRevenue } from '@/actions/dashboard';

export async function RevenueCard() {
  const { dailyRevenue, comparedToYesterday } = await getDailyRevenue();

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Daily Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>${dailyRevenue.toFixed(2)}</div>
        <p className='text-xs text-muted-foreground'>
          {comparedToYesterday > 0 ? '+' : ''}
          {comparedToYesterday}% from yesterday
        </p>
      </CardContent>
    </Card>
  );
}
