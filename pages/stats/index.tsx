import React from 'react';
import { trpc } from '../../utils/trpc';
import AvaragePriceGraph from '../../components/AvaragePriceGraph';
import BidsCountGraph from '../../components/BidsCountGraph';
import Tabs from 'rc-tabs';

export default function Stats() {
  const states = trpc.statsData.useQuery();

  const items = [
    {
      key: 'week',
      label: 'Week',
      children: (
        <>
          <AvaragePriceGraph
            periodData={states.data?.prices.weekPriceStats}
            backgroundShadowLimit={0.3}
          />
          <BidsCountGraph periodData={states.data?.bids.weekBidsStats} periodType="week" />
        </>
      ),
      destroyInactiveTabPane: true,
    },
    {
      key: '1',
      label: '|',
      children: '',
      destroyInactiveTabPane: true,
      disabled: true,
    },
    {
      key: 'month',
      label: 'Month',
      children: (
        <>
          <AvaragePriceGraph
            periodData={states.data?.prices.monthPriceStats}
            backgroundShadowLimit={0.5}
          />
          <BidsCountGraph periodData={states.data?.bids.monthBidsStats} periodType="month" />
        </>
      ),
      destroyInactiveTabPane: true,
    },
    {
      key: '2',
      label: '|',
      children: '',
      destroyInactiveTabPane: true,
      disabled: true,
    },
    {
      key: 'year',
      label: <span>Year</span>,
      children: (
        <>
          <AvaragePriceGraph
            periodData={states.data?.prices.yearPriceStats}
            backgroundShadowLimit={5}
          />
          <BidsCountGraph periodData={states.data?.bids.yearBidsStats} periodType="year" />
        </>
      ),
      destroyInactiveTabPane: true,
    },
  ];
  return (
    <>
      <Tabs tabBarGutter={5} tabPosition="top" items={items} defaultActiveKey="week" />
      <style>{`
        .rc-tabs-nav-list {
          display: flex;
          color: var(--mid-text)
        }
        .rc-tabs-tab-active {
          color: var(--bright-text)
        }
        .rc-tabs-ink-bar-animated {
          display: none;
        }
      `}</style>
    </>
  );
}
