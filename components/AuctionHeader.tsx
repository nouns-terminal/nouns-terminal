/* eslint-disable @next/next/no-img-element */
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useAccount, useSigner, useSwitchNetwork } from 'wagmi';
import { NounsAuctionHouse__factory } from '../typechain';
import { NOUNS_AUCTION_HOUSE_ADDRESS, NOUNS_TOKEN_ADDRESS } from '../utils/constants';
import Bidding from './Bidding';
import Stack from './Stack';
import Text from './Text';
import { ImageData, getNounData } from '@nouns/assets';
import { buildSVG } from '@nouns/sdk/dist/image/svg-builder';
import { type Noun } from '../server/getAuctionData';
import Head from 'next/head';

type Props = {
  id: number;
  startTime: number;
  endTime: number;
  maxBid: string | null;
  ended: boolean;
  winner: string | null;
  noun: Noun | null;
};

export default function AuctionHeader(props: Props) {
  const { data: signer, refetch } = useSigner();
  const { isConnected } = useAccount();
  const { switchNetworkAsync } = useSwitchNetwork();

  const submitBidMutation = useMutation(async (bid: BigNumber) => {
    let effectiveSigner = signer;
    if (!effectiveSigner) {
      return;
    }
    const chainId = await effectiveSigner.getChainId();
    if (chainId !== 1) {
      if (!switchNetworkAsync) {
        alert('Please switch to Ethereum Mainnet');
        return;
      }
      try {
        await switchNetworkAsync(1);
        effectiveSigner = (await refetch()).data;
      } catch (error) {
        console.error(error);
        return;
      }
    }
    if (!effectiveSigner) {
      console.error(
        'Effective signer is undefined. Please ensure the signer is properly initialized.'
      );
      alert('Something went wrong!');
      return;
    }
    const contract = NounsAuctionHouse__factory.connect(
      NOUNS_AUCTION_HOUSE_ADDRESS,
      effectiveSigner
    );

    // Gas limit estimation might fail if the wallet doesn't have enough balance
    // We don't want to show user a confusing error, instead we let the wallet
    // handle it
    // TODO: This doesn't work well on mobile
    // const gasLimit = await contract.estimateGas
    //   .createBid(props.id, { value: bid })
    //   .catch(() => BigNumber.from(2_000_000));

    await contract.createBid(props.id, { value: bid, gasLimit: 2_000_000 });
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
          {new Date(props.startTime * 1000).toDateString()}
        </Text>
        <Text variant="title-1" bold color={props.ended ? 'mid-text' : 'yellow'}>
          Noun {props.id}
        </Text>
      </Stack>
      <Stack direction="column" gap={-1}>
        <Text variant="title-3" bold color={props.ended ? 'low-text' : 'mid-text'}>
          {props.ended ? 'Winning Bid' : 'Current bid'}
        </Text>
        <Text variant="title-1" bold color={props.ended ? 'mid-text' : 'bright-text'}>
          {props.maxBid ? `Ξ${formatEther(BigNumber.from(props.maxBid))}` : '—'}
        </Text>
      </Stack>
      {props.ended ? (
        <Stack direction="column" gap={-1}>
          <Text variant="title-3" bold color={props.ended ? 'low-text' : 'mid-text'}>
            Won By
          </Text>
          <Text variant="title-1" bold color="mid-text">
            <div className="address">{props.winner}</div>
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
        <>
          <div style={{ flex: 1 }} />
          <Bidding
            currentBid={props.maxBid ? BigNumber.from(props.maxBid) : BigNumber.from(0)}
            onSubmitBid={(bid) => submitBidMutation.mutateAsync(bid)}
          />
        </>
      )}
      <style jsx>{`
        .address {
          max-width: 18ch;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .image {
          width: 2.8rem;
          background-color: #d5d7e1;
        }
      `}</style>
    </Stack>
  );
}

function Countdown({ to }: { to: number }) {
  const now = useNow();
  const delta = to - now;
  return <>{delta <= 0 ? 'Now' : formatTimeLeft(delta)}</>;
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
