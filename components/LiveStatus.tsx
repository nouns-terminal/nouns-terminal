import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { latestWebSocket } from '../pages/_app';

const isLive = atom(false);

export default function LiveStatus() {
  const [, setLive] = useAtom(isLive);

  useEffect(() => {
    const interval = setInterval(() => {
      setLive(
        () => typeof window !== 'undefined' && latestWebSocket?.readyState === WebSocket.OPEN
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [setLive]);

  return null;
}

export function useIsLive() {
  const [result] = useAtom(isLive);

  return result;
}
