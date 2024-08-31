import React from 'react';
import { trpc } from '../utils/trpc';
import Graphs from '../components/Graphs';

export default function Stats() {
  const states = trpc.statsData.useQuery();

  return <Graphs stats={states.data} />;
}
