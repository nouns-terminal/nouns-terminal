/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from 'react';
import { useAccount, useSwitchChain, useWriteContract, useEnsName } from 'wagmi';
import { CLIENT_ID, NOUNS_AUCTION_HOUSE_ADDRESS } from '../utils/constants';
import Bidding from './Bidding';
import Stack from './Stack';
import Text from './Text';
import type { SlideOverContent, Noun } from '../server/api/types';
import Head from 'next/head';
import { PendingBid, hoveredAddress } from './BidsTable';
import { useSetAtom } from 'jotai';
import { useMutation } from '@tanstack/react-query';
import ClientOnly from './ClientOnly';
import { createNounSVG, formatBidValue } from '../utils/utils';
import { ExternalLinkIcon } from './Icons';

type Props = {
  id: number;
  startTime: number;
  endTime: number;
  maxBid: string | null;
  ended: boolean;
  winner: { address: string; ens: string | null };
  owner: { address: string; ens: string | null };
  noun: Noun | null;
  onSubmitBid: (bid: PendingBid) => void;
  onNounClick: (content: SlideOverContent) => void;
  onBidderClick: (content: SlideOverContent) => void;
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
        return null;
      }

      props.onSubmitBid({
        tx,
        walletAddress: address,
        ens: data ?? null,
        value: bid.toString(),
        extended: false,
        timestamp: Date.now() / 1000, // Convert to seconds to match the date format in the database
        maxFeePerGas: '0',
        walletBalance: null,
        walletBalanceChange: null,
        clientId: CLIENT_ID,
      });
    },
  });

  const svgBase64 = useMemo(() => {
    if (!props.noun) {
      return '';
    }

    return createNounSVG(props.noun, true);
  }, [props.noun]);

  return (
    <Stack direction="row" gap={2}>
      {!props.ended && svgBase64 && (
        <Head>
          <link rel="icon" href={svgBase64} type="image/svg+xml" />
        </Head>
      )}
      <div
        className="image"
        onClick={() => {
          props.onNounClick({ type: 'noun', id: props.noun?.id });
        }}
      >
        {svgBase64 && <img alt={`Noun ${props.id}`} src={svgBase64} width="100%" height="100%" />}
      </div>
      <Stack direction="column" gap={-1}>
        <Text variant="title-3" color={props.ended ? 'low-text' : 'mid-text'}>
          <span suppressHydrationWarning>{new Date(props.startTime * 1000).toDateString()}</span>
        </Text>
        <a target="_blank" rel="noreferrer" href={`/noun/${props.id}`}>
          <Text variant="title-1" bold color={props.ended ? 'mid-text' : 'yellow'}>
            <span data-testid="noun-id">Noun {props.id}</span>
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
        <>
          <Stack direction="column" gap={-1}>
            <Text variant="title-3" bold color={props.ended ? 'low-text' : 'mid-text'}>
              Won By
            </Text>
            <Text variant="title-1" bold color="mid-text">
              <div
                className="address"
                onMouseEnter={() => setAddress(props.winner.address || '')}
                onMouseLeave={() => setAddress('')}
                onClick={() => {
                  props.onBidderClick({ type: 'bidder', address: props.winner.address });
                }}
              >
                {props.winner.ens || props.winner.address}
              </div>
            </Text>
          </Stack>
          {props.owner.address && props.owner.address !== props.winner.address && (
            <Stack direction="column" gap={-1}>
              <Text variant="title-3" bold color={props.ended ? 'low-text' : 'mid-text'}>
                Current Owner
              </Text>
              <Text variant="title-1" bold color="mid-text">
                <div
                  className="address"
                  onMouseEnter={() => setAddress(props.owner.address || '')}
                  onMouseLeave={() => setAddress('')}
                  onClick={() => {
                    props.onBidderClick({ type: 'bidder', address: props.owner.address });
                  }}
                >
                  {props.owner.ens || props.owner.address}
                </div>
              </Text>
            </Stack>
          )}
        </>
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
          cursor: pointer;
        }
        .image {
          width: 2.8rem;
          background-color: #d5d7e1;
          cursor: pointer;
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
  return (
    <span suppressHydrationWarning>
      {delta <= 0 ? (
        <>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://fomonouns.wtf/"
            className="settling-link"
          >
            <span className="settling-title">SETTLING</span>
            <ExternalLinkIcon />
          </a>
        </>
      ) : (
        formatTimeLeft(delta)
      )}
      <style jsx>{`
        .settling-title {
          margin-right: var(--s-2);
        }
        .settling-link:hover {
          color: var(--yellow);
        }
      `}</style>
    </span>
  );
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
