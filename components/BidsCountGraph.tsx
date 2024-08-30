import React from 'react';
import { BarChart, Bar, YAxis, Tooltip, Cell, ResponsiveContainer, XAxis } from 'recharts';

export default function BidsCountGraph({
  periodData,
  weeksAmount,
}: {
  periodData:
    | {
        timestamp: number | null;
      }[]
    | undefined;
  weeksAmount: number;
}) {
  if (!periodData) {
    return;
  }

  const data: { count: number; date: Date; period?: string }[] = Array.from({
    length: weeksAmount,
  }).map((_, i) => ({
    count: 0,
    date: new Date(),
  }));
  periodData
    .filter((period): period is { timestamp: number } => period.timestamp != null)
    .forEach((period) => {
      const week = Math.round(period.timestamp / (60 * 60 * 24 * 7));
      const index = week % data.length;
      data[index].count++;
      data[index].date = new Date(period.timestamp * 1000);
    });
  const maxBidsCount = Math.max(...data.map((bids) => bids.count));
  data.sort((a, b) => a.date.getTime() - b.date.getTime());

  data.forEach((item, index) => {
    const currentDate = item.date;
    const nextDate = data[index + 1]?.date || new Date();
    const endDate = new Date(nextDate.getTime() - 24 * 60 * 60 * 1000);

    item.period = `${currentDate.toDateString()} - ${endDate.toDateString()}`;
  });
  return (
    <div style={{ height: 100, width: 500 }}>
      <span style={{ color: 'var(--mid-text)' }}>#BIDS</span>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 0, bottom: 0, left: 20 }}>
          <YAxis
            dataKey="count"
            orientation="right"
            axisLine={false}
            interval={2}
            tickSize={10}
            ticks={[maxBidsCount]}
          />
          <XAxis
            dataKey="period"
            orientation="bottom"
            axisLine={false}
            tickSize={15}
            interval={4}
            tickFormatter={(tick: string) => tick.split(' ')[1]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface-bg)',
              border: 'none',
              borderRadius: '5px',
              padding: '5px',
            }}
            cursor={false}
            labelStyle={{ color: 'var(--mid-text)' }}
            itemStyle={{ color: 'var(--bright-text)' }}
            formatter={(value) => `${value}`}
          />
          <Bar dataKey="count" height={10}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                strokeWidth={1}
                stroke="var(--mid-text)"
                radius={2}
                fill={index != data.length - 1 ? 'var(--mid-text)' : 'var(--hint-text)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
