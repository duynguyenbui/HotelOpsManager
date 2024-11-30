import { RoomType } from '@prisma/client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface RoomTypeCardProps {
  roomType: RoomType;
}

export function RoomeTypeCard({ roomType }: RoomTypeCardProps) {
  return (
    <Link
      className='transition-transform duration-300 hover:scale-105'
      href={`/roomtypes/${roomType.id}/edit`}
    >
      <Card className='h-full flex flex-col'>
        <CardHeader>
          <CardTitle># {roomType.name}</CardTitle>
        </CardHeader>
        <CardContent className='flex-grow'>
          <div className='space-y-2'>
            <p className='text-sm text-gray-500'>{roomType.description}</p>
            <div className='flex items-center space-x-2'>
              <Users className='h-4 w-4 text-gray-400' />
              <span>Capacity: {roomType.capacity}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <DollarSign className='h-4 w-4 text-gray-400' />
              <span>Price per night: ${roomType.price.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className='w-full'>
            <h4 className='font-semibold mb-2'>Amenities:</h4>
            <div className='flex flex-wrap gap-2'>
              {roomType.amenities.map((amenity, index) => (
                <Badge key={index} variant='secondary'>
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
