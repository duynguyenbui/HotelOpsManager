import { CalendarDays, CreditCard, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const bookingSteps = [
  {
    title: 'Check Availability',
    icon: Search,
  },
  {
    title: 'Select and Book',
    icon: CalendarDays,
  },
  {
    title: 'Payment',
    icon: CreditCard,
  },
];

export function BookingProcess() {
  return (
    <div className='flex flex-col sm:flex-row gap-4'>
      {bookingSteps.map((step, index) => (
        <Card key={index} className='flex-1'>
          <CardHeader>
            <CardTitle className='flex items-center text-lg'>
              <step.icon className='mr-2 h-5 w-5' />
              <span>Step {index + 1}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm'>{step.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
