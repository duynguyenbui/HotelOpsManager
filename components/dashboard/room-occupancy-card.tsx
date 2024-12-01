import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRoomOccupancy } from '@/actions/dashboard';

export async function RoomOccupancyCard() {
  const { occupiedRooms, totalRooms, occupancyRate } = await getRoomOccupancy();

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>Room Occupancy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{occupancyRate}%</div>
        <p className='text-xs text-muted-foreground'>
          {occupiedRooms} out of {totalRooms} rooms occupied
        </p>
      </CardContent>
    </Card>
  );
}
