import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUpcomingCheckIns } from '@/actions/dashboard';

export async function UpcomingCheckInsCard() {
  const { upcomingCheckIns } = await getUpcomingCheckIns();

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>
          Upcoming Check-ins
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{upcomingCheckIns}</div>
        <p className='text-xs text-muted-foreground'>Expected today</p>
      </CardContent>
    </Card>
  );
}
