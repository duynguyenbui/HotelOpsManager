'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, BedDouble } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getAvailableRooms } from '@/lib/transactions';
import { RoomWithType } from '@/types';
import { toast } from 'sonner';
import { TimePicker } from '@/components/ui/time-picker';
import { Badge } from '@/components/ui/badge';
import { useTransactionModal } from '@/hooks/use-transaction-modal';

type Room = RoomWithType;

export const RoomAvailability = () => {
  const { onOpen } = useTransactionModal();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
  );
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.');
      return;
    }

    if (startDate >= endDate) {
      toast.error('End date must be after start date.');
      return;
    }

    try {
      console.log('startDate', startDate);
      console.log('endDate', endDate);

      const rooms = await getAvailableRooms(startDate, endDate);
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full sm:w-[240px] justify-start text-left font-normal',
                !startDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {startDate ? (
                format(startDate, 'PPP')
              ) : (
                <span>Pick a start date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={startDate}
              onSelect={(date) => date && setStartDate(date)}
              initialFocus
              disabled={(date) =>
                date < new Date() || date < new Date('1900-01-01')
              }
            />
            <div className='p-3 border-t border-border'>
              <TimePicker
                setDate={(date) => date && setStartDate(date)}
                date={startDate}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-full sm:w-[240px] justify-start text-left font-normal',
                !endDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className='mr-2 h-4 w-4' />
              {endDate ? format(endDate, 'PPP') : <span>Pick an end date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={endDate}
              onSelect={(date) => date && setEndDate(date)}
              initialFocus
              disabled={(date) =>
                date < new Date() || date < new Date('1900-01-01')
              }
            />
            <div className='p-3 border-t border-border'>
              <TimePicker
                setDate={(date) => date && setEndDate(date)}
                date={endDate}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Button onClick={handleSearch} className='w-full sm:w-auto'>
          Search
        </Button>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 '>
        {availableRooms.map((room) => (
          <div onClick={() => onOpen({ startDate, endDate })} key={room.id}>
            <Card
              key={room.id}
              className='overflow-hidden transition-transform duration-300 hover:scale-105'
            >
              <div className='relative'>
                <img
                  src={room.imageUrls[0]}
                  alt={`Room ${room.roomNumber}`}
                  className='w-full h-48 object-cover'
                />
                <Badge className='absolute top-2 right-2 bg-primary text-primary-foreground'>
                  {room.type.name}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <BedDouble className='mr-2 h-5 w-5' />
                  Room # {room.roomNumber}
                </CardTitle>
                <div className='flex space-x-4 justify-between'>
                  <div>
                    <CardDescription>Floor: {room.floor}</CardDescription>
                    <CardDescription>
                      Capacity: {room.type.capacity}
                    </CardDescription>
                  </div>
                  <div>
                    <CardDescription>
                      Price: ${room.type.price.toFixed(2)}
                    </CardDescription>
                  </div>
                </div>
                <div className='flex space-y-2'>
                  {room.type.amenities.map((amenity) => (
                    <Badge key={amenity}>{amenity}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>
                  Enjoy our comfortable {room.type.name.toLowerCase()} room with
                  modern amenities.
                </p>
              </CardContent>
              <CardFooter>
                <Button className='w-full'>Book Now</Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
