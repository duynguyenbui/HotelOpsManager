import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

export function RoomListSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {[...Array(6)].map((_, index) => (
        <Card key={index} className='overflow-hidden animate-pulse'>
          <div className='h-48 bg-gray-200' />
          <CardHeader>
            <div className='h-6 bg-gray-200 rounded w-3/4' />
          </CardHeader>
          <CardContent>
            <div className='space-y-2'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='h-4 bg-gray-200 rounded w-full' />
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <div className='h-10 bg-gray-200 rounded w-full' />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
