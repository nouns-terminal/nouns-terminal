import React from 'react';
import { BarChart, Bar, YAxis, Tooltip, Cell, ResponsiveContainer, XAxis } from 'recharts';

export default function BidsCountGraph({
  periodData,
  periodType,
}: {
  periodData:
    | {
        timestamp: number | null;
      }[]
    | undefined;
  periodType: string;
}) {
  if (!periodData) {
    return;
  }
  let data: { name: string; count: number }[] = [];
  let maxBidsCount = 0;
  let ticksValues: string[] = [];
  if (periodType === 'week') {
    data = [
      { name: 'Monday', count: 0 },
      { name: 'Tuesday', count: 0 },
      { name: 'Wednesday', count: 0 },
      { name: 'Thursday', count: 0 },
      { name: 'Friday', count: 0 },
      { name: 'Saturday', count: 0 },
      { name: 'Sunday', count: 0 },
    ];
    periodData
      .filter((period): period is { timestamp: number } => period.timestamp != null)
      .forEach((period) => {
        const date = new Date(period.timestamp * 1000);
        data[date.getDay()].count++;
      });
    maxBidsCount = Math.max(...data.map((bids) => bids.count));
    ticksValues = [data[Math.floor(data.length / 2)].name];
  }
  if (periodType === 'month') {
    data = [
      { name: 'Monday', count: 0 },
      { name: 'Tuesday', count: 0 },
      { name: 'Wednesday', count: 0 },
      { name: 'Thursday', count: 0 },
      { name: 'Friday', count: 0 },
      { name: 'Saturday', count: 0 },
      { name: 'Sunday', count: 0 },
    ];
    periodData
      .filter((period): period is { timestamp: number } => period.timestamp != null)
      .forEach((period) => {
        const date = new Date(period.timestamp * 1000);
        data[date.getDay()].count++;
      });
    maxBidsCount = Math.max(...data.map((bids) => bids.count));
    ticksValues = [data[Math.floor(data.length / 2)].name];
  }

  return (
    <div style={{ height: 200, width: 500 }}>
      <span style={{ color: 'var(--mid-text)' }}>#BIDS</span>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 0, right: 0, bottom: 30, left: 0 }}>
          <YAxis
            dataKey="count"
            orientation="right"
            axisLine={false}
            interval={2}
            tickSize={10}
            ticks={[maxBidsCount]}
          />
          <XAxis
            dataKey="name"
            orientation="bottom"
            axisLine={false}
            interval={2}
            tickSize={10}
            ticks={ticksValues}
          />
          <Tooltip cursor={{ color: 'var(--bright-text)', opacity: '0.4' }} />
          <Bar dataKey="count">
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
