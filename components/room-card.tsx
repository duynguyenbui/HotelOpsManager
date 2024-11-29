import { Room, RoomType } from '@prisma/client';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bed, Users, CreditCard, Wifi, Tv, Coffee, MapPin } from 'lucide-react';
import Link from 'next/link';

type RoomWithType = Room & {
  type: RoomType;
};

export const RoomCard = ({ room }: { room: RoomWithType }) => {
  const amenityIcons: { [key: string]: JSX.Element } = {
    'Wi-Fi': <Wifi className='w-4 h-4' />,
    TV: <Tv className='w-4 h-4' />,
    'Coffee Maker': <Coffee className='w-4 h-4' />,
  };

  return (
    <Link href={`/rooms/${room.id}/edit`}>
      <Card className='overflow-hidden transition-all duration-300 hover:shadow-lg'>
        <div className='relative h-48'>
          <Image
            src={room.imageUrl || '/placeholder.svg'}
            alt={`Room ${room.roomNumber}`}
            layout='fill'
            objectFit='cover'
            className='transition-transform duration-300 hover:scale-110'
          />
          <Badge
            variant={room.status === 'READY' ? 'default' : 'destructive'}
            className='absolute top-2 right-2'
          >
            {room.status}
          </Badge>
        </div>
        <CardHeader className='pb-2'>
          <CardTitle className='flex justify-between items-center'>
            <span className='text-xl font-bold'>Room #{room.roomNumber}</span>
            <Badge variant='outline' className='text-sm font-normal'>
              {room.type.name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className='pb-2'>
          <div className='grid grid-cols-2 gap-2 text-sm'>
            <div className='flex items-center space-x-2 text-gray-600'>
              <MapPin className='w-4 h-4' />
              <span>Floor {room.floor}</span>
            </div>
            <div className='flex items-center space-x-2 text-gray-600'>
              <Users className='w-4 h-4' />
              <span>Up to {room.type.capacity} guests</span>
            </div>
            <div className='flex items-center space-x-2 text-gray-600'>
              <Bed className='w-4 h-4' />
              <span>{room.type.name}</span>
            </div>
            <div className='flex items-center space-x-2 text-blue-600 font-semibold'>
              <CreditCard className='w-4 h-4' />
              <span>${room.type.price.toFixed(2)}/day</span>
            </div>
          </div>
          <div className='mt-4'>
            <p className='text-sm font-semibold mb-2'>Amenities:</p>
            <div className='flex gap-2'>
              {room.type.amenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant='secondary'
                  className='text-muted-foreground'
                >
                  {amenityIcons[amenity] || null}
                  <span>{amenity}</span>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
