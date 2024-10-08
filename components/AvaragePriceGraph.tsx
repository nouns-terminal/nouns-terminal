import React from 'react';
import { ComposedChart, Area, YAxis, Tooltip, ResponsiveContainer, XAxis } from 'recharts';
import { formatBidValue } from '../utils/utils';

export default function AvaragePriceGraph({
  periodData,
  backgroundShadowLimit,
}: {
  periodData?: {
    id: number;
    price: string | null;
    startTime: number;
  }[];
  backgroundShadowLimit: number;
}) {
  if (!periodData) {
    return null;
  }

  const data = periodData
    .map((auction) => {
      const price = parseFloat(formatBidValue(BigInt(auction.price || '0')));
      const background = [price - backgroundShadowLimit, price + backgroundShadowLimit];
      return {
        id: auction.id,
        date: new Date(auction.startTime * 1000).toDateString(),
        price,
        background,
      };
    })
    .sort((a, b) => a.id - b.id);

  return (
    <div className="composedChartContainer">
      <span style={{ color: 'var(--mid-text)' }}>#PRICES</span>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 30, right: 0, bottom: 30, left: 0 }}>
          <YAxis
            dataKey="price"
            orientation="right"
            axisLine={false}
            tickSize={10}
            tickFormatter={(price) => ` ${price}Ξ`}
            interval={2}
          />
          <XAxis dataKey="date" axisLine={false} display={'none'} />
          <Area dataKey="price" stroke="var(--yellow)" fill="none" />
          <Area
            dataKey="background"
            stroke="none"
            fillOpacity={0.3}
            fill="var(--yellow)"
            activeDot={false}
            tooltipType="none"
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
            formatter={(value) => `Ξ${value}`}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <style jsx>{`
        .composedChartContainer {
          height: 200px;
          width: 1000px;
        }
        @media only screen and (max-width: 600px) {
          .composedChartContainer {
            width: 350px;
          }
        }
        @media only screen and (min-width: 600px) and (max-width: 1100px) {
          .composedChartContainer {
            width: 550px;
          }
        }
      `}</style>
    </div>
  );
}
