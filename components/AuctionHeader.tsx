/* eslint-disable @next/next/no-img-element */
import { formatEther } from 'viem';
import { useEffect, useMemo, useState } from 'react';
import { useAccount, useSwitchChain, useWriteContract, useEnsName } from 'wagmi';
import { CLIENT_ID, NOUNS_AUCTION_HOUSE_ADDRESS, NOUNS_TOKEN_ADDRESS } from '../utils/constants';
import Bidding from './Bidding';
import Stack from './Stack';
import Text from './Text';
import { ImageData, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk/dist/image/svg-builder';
import { type Noun } from '../server/api/types';
import Head from 'next/head';
import { PendingBid, hoveredAddress } from './BidsTable';
import { useSetAtom } from 'jotai';
import { useMutation } from '@tanstack/react-query';
import ClientOnly from './ClientOnly';

type Props = {
  id: number;
  startTime: number;
  endTime: number;
  maxBid: string | null;
  ended: boolean;
  winnerENS: string | null;
  winnerAddress: string | null;
  noun: Noun | null;
  onSubmitBid: (bid: PendingBid) => unknown;
};

const abi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'nounId',
        type: 'uint256',
      },
      {
        internalType: 'uint32',
        name: 'clientId',
        type: 'uint32',
      },
    ],
    name: 'createBid',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

export default function AuctionHeader(props: Props) {
  const { isConnected, chainId, address } = useAccount();
  const { data } = useEnsName({ address });
  const { switchChainAsync } = useSwitchChain();
  const write = useWriteContract({});
  const setAddress = useSetAtom(hoveredAddress);

  const bidMutation = useMutation({
    mutationFn: async (bid: bigint) => {
      if (chainId !== 1) {
        await switchChainAsync({ chainId: 1 });
      }
      const tx = await write.writeContractAsync({
        __mode: 'prepared', //  We are using this to allow the user's wallet to simulate the transaction and show if they don't have enough money
        abi,
        address: NOUNS_AUCTION_HOUSE_ADDRESS,
        functionName: 'createBid',
        args: [props.id, CLIENT_ID],
        value: bid,
        chainId: 1,
      });

      if (!address) {
        return;
      }

      props.onSubmitBid({
        tx,
        walletAddress: address,
        ens: data ?? null,
        value: bid.toString(),
        extended: false,
        timestamp: Date.now(),
        maxFeePerGas: '0',
        walletBalance: null,
      });
    },
  });

  const svgBase64 = useMemo(() => {
    if (!props.noun) {
      return '';
    }

    try {
      const data = getNounData(props.noun);
      const { parts, background } = data;

      const svgBinary = buildSVG(parts, ImageData.palette, background);
      return 'data:image/svg+xml;base64,' + btoa(svgBinary);
    } catch (e) {
      console.error(e);
      return '';
    }
  }, [props.noun]);

  return (
    <Stack direction="row" gap={2}>
      {!props.ended && svgBase64 && (
        <Head>
          <link rel="icon" href={svgBase64} type="image/svg+xml" />
        </Head>
      )}

      <a
        target="_blank"
        rel="noreferrer"
        href={`https://opensea.io/assets/ethereum/${NOUNS_TOKEN_ADDRESS}/${props.id}`}
      >
        <div className="image">
          {svgBase64 && <img alt={`Noun ${props.id}`} src={svgBase64} width="100%" height="100%" />}
        </div>
      </a>
      <Stack direction="column" gap={-1}>
        <Text variant="title-3" color={props.ended ? 'low-text' : 'mid-text'}>
          <span suppressHydrationWarning>{new Date(props.startTime * 1000).toDateString()}</span>
        </Text>
        <a target="_blank" rel="noreferrer" href={`/noun/${props.id}`}>
          <Text variant="title-1" bold color={props.ended ? 'mid-text' : 'yellow'}>
            Noun {props.id}
          </Text>
        </a>
      </Stack>
      <Stack direction="column" gap={-1}>
        <Text variant="title-3" bold color={props.ended ? 'low-text' : 'mid-text'}>
          {props.ended ? 'Winning Bid' : 'Current bid'}
        </Text>
        <Text variant="title-1" bold color={props.ended ? 'mid-text' : 'bright-text'}>
          {props.maxBid ? `Ξ${formatBidValue(BigInt(props.maxBid))}` : '—'}
        </Text>
      </Stack>
      {props.ended ? (
        <Stack direction="column" gap={-1}>
          <Text variant="title-3" bold color={props.ended ? 'low-text' : 'mid-text'}>
            Won By
          </Text>
          <Text variant="title-1" bold color="mid-text">
            <div
              className="address"
              onMouseEnter={() => setAddress(props.winnerAddress || '')}
              onMouseLeave={() => setAddress('')}
            >
              {props.winnerENS || props.winnerAddress}
            </div>
          </Text>
        </Stack>
      ) : (
        <Stack direction="column" gap={-1}>
          <Text variant="title-3" bold color={props.ended ? 'low-text' : 'mid-text'}>
            End in
          </Text>
          <Text variant="title-1" bold color="bright-text">
            <Countdown to={props.endTime * 1000} />
          </Text>
        </Stack>
      )}
      {!props.ended && isConnected && (
        <ClientOnly>
          <div style={{ flex: 1 }} />
          <Bidding
            currentBid={props.maxBid ? BigInt(props.maxBid) : 0n}
            onSubmitBid={(bid) => bidMutation.mutateAsync(bid)}
            isLoading={bidMutation.isPending}
          />
        </ClientOnly>
      )}
      <style jsx>{`
        .address {
          max-width: 42ch;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .image {
          width: 2.8rem;
          background-color: #d5d7e1;
        }
        @media only screen and (max-width: 950px) {
          .address {
            max-width: 20ch;
          }
        }
        @media only screen and (min-width: 950px) and (max-width: 1200px) {
          .address {
            max-width: 35ch;
          }
        }
      `}</style>
    </Stack>
  );
}

function Countdown({ to }: { to: number }) {
  const now = useNow();
  const delta = to - now;
  return <span suppressHydrationWarning>{delta <= 0 ? 'SETTLING' : formatTimeLeft(delta)}</span>;
}

function formatBidValue(value: bigint) {
  const s = formatEther(value);
  if (s.includes('.')) {
    return s;
  }
  return s + '.0';
}

function formatTimeLeft(delta: number) {
  const pad2 = (n: number) => n.toString().padStart(2, '0');
  const hours = Math.floor(delta / (60 * 60 * 1000));
  const minutes = Math.floor(delta / (60 * 1000)) % 60;
  const seconds = Math.floor(delta / 1000) % 60;

  let result = `${hours}h ${pad2(minutes)}m ${pad2(seconds)}s`;

  return result;
}

function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return now;
}
