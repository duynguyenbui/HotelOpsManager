'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

interface RoomTypeDistributionProps {
  data: Array<{ name: string; value: number }>;
}

export function RoomTypeDistributionCard({ data }: RoomTypeDistributionProps) {
  return (
    <Card className='col-span-3'>
      <CardHeader>
        <CardTitle>Room Type Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            ...Object.fromEntries(
              data.map((item, index) => [
                item.name,
                { label: item.name, color: COLORS[index % COLORS.length] },
              ])
            ),
          }}
          className='h-[300px]'
        >
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={data}
                cx='50%'
                cy='50%'
                labelLine={false}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey='name' />}
                className='flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center'
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
