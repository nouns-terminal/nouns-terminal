import React from 'react';
import Stack from './Stack';
import Text from './Text';
import { trpc } from '../utils/trpc';
import { formatEther } from 'viem';
import { ExternalLinkIcon } from './Icons';
import { ImageData, getNounData } from '@nouns/assets';
import { Noun, BidderHistory, Social } from '../server/api/types';
import { buildSVG } from '@nouns/sdk/dist/image/svg-builder';
import Link from 'next/link';

export default function BidderProfile({ address }: { address: string | null }) {
  if (!address) {
    return null;
  }

  const wallet = trpc.walletData.useQuery({ address: address });

  return (
    <>
      <ProfileHeader
        address={address}
        ens={wallet.data?.ens}
        balance={wallet.data?.balance}
        nouns={wallet.data?.nouns as Noun[]}
        domains={wallet.data?.domains}
        dapps={wallet.data?.dapps}
      />
      <ProfileInfo
        wins={Number(wallet.data?.wins.count || 0)}
        bidderHistory={wallet.data?.bidderHistory as BidderHistory[]}
        address={address}
        largestBid={wallet.data?.largestBid}
      />
      <div style={{ height: 'var(--s2)' }} />
    </>
  );
}

function ProfileHeader({
  address,
  ens,
  balance,
  nouns,
  domains,
  dapps,
}: {
  address: string;
  ens: string | null | undefined;
  balance:
    | {
        eth: string | undefined;
        usd: string | undefined;
      }
    | undefined;
  nouns: Noun[] | undefined;
  domains: Social[] | undefined;
  dapps: Social[] | undefined;
}) {
  const nounSVGs = nouns?.map((noun) => createNounSVG(noun, true));
  const domainNicknames = [
    ens,
    ...(domains?.filter((domain) => domain.nickname !== ens).map((domain) => domain.nickname) ||
      []),
  ].join(' • ');

  return (
    <div style={{ backgroundColor: 'var(--dark-bg)' }}>
      <div className="content">
        <Stack direction="column" gap={-1}>
          <Text variant="large-title" bold color="bright-text">
            {parseAddress(address)}
            <a
              title={parseAddress(address)}
              target="_blank"
              rel="noreferrer"
              href={`https://etherscan.io/address/${address}`}
              className="external-link"
            >
              <ExternalLinkIcon />
            </a>
          </Text>
          <div
            style={{
              height: '1rem',
              maxWidth: '42ch',
              overflow: 'hidden',
              textOverflow: 'clip',
              whiteSpace: 'nowrap',
            }}
          >
            <Text variant="headline" bold color="low-text">
              {domainNicknames.length < 42 ? (
                domainNicknames
              ) : (
                <LiveLine text={domainNicknames + ' • '} />
              )}
            </Text>
          </div>
          <div
            style={{
              height: '1rem',
            }}
          >
            {dapps && dapps.length > 0 && (
              <Text variant="headline" bold color="low-text">
                {dapps.map((dapp, index) => (
                  <>
                    <a
                      href={`https://warpcast.com/${dapp.nickname}`}
                      key={index}
                      target="_blank"
                      rel="noreferrer"
                      className="social-link"
                    >
                      {dapp.type}
                    </a>
                    {index < dapps.length - 1 ? ' • ' : ''}
                  </>
                ))}
              </Text>
            )}
          </div>
          <div className="dotted-hr" />
        </Stack>
        <div className="balance">
          <Stack direction="column" gap={1}>
            <Text variant="title-1" bold color="low-text">
              Balance
            </Text>
            <Stack direction="column" gap={-1}>
              <Text variant="large-title" bold color="bright-text">
                Ξ{formatEther(BigInt(balance?.eth || 0)).slice(0, 6)}
              </Text>
              <Text variant="headline" bold color="low-text">
                {formatUsdPrice(Number(balance?.usd || '0'))}
              </Text>
            </Stack>
          </Stack>
          <div className="extra-space" />
          <div className="nouns">
            {nouns &&
              nounSVGs &&
              nounSVGs.length > 0 &&
              nounSVGs.map((nounSVG, index) => (
                <Link
                  href={
                    nouns[index].id % 10 === 0
                      ? `https://opensea.io/assets/ethereum/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03/${nouns[index].id}`
                      : `/noun/${nouns[index].id}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  key={index}
                >
                  <img
                    src={nounSVG}
                    alt={`Noun ${nouns[index].id}`}
                    style={{ paddingBottom: 'var(--s-2)', width: '24px' }}
                  />
                </Link>
              ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .dotted-hr {
          height: 1px;
          background-image: linear-gradient(to right, var(--lines) 90%, rgba(0, 0, 0, 0) 10%);
          background-size: var(--s2) 1px;
          margin: var(--s0) 0 var(--s1) 0;
        }
        .extra-space {
          width: var(--s5);
        }
        .content {
          margin: var(--s1) var(--s2) 0 var(--s1);
        }
        .external-link {
          margin-left: var(--s-2);
          color: var(--low-text);
        }
        .external-link:hover {
          color: var(--bright-text);
        }
        .balance {
          display: flex;
          align-items: flex-start;
          direction: column;
          justify-content: left;
        }
        .nouns {
          display: flex;
          flex-wrap: wrap;
          gap: var(${'--s-2'});
          max-width: 50%;
          height: 6rem;
          overflow-y: auto;
        }
        .social-link:hover {
          color: var(--bright-text);
        }
      `}</style>
      <HorizontalLine />
    </div>
  );
}

function ProfileInfo({
  wins,
  bidderHistory,
  address,
  largestBid,
}: {
  wins: number;
  bidderHistory: BidderHistory[] | undefined;
  address: string;
  largestBid:
    | {
        id: number;
        value: string;
        noun: Noun;
      }
    | undefined
    | null;
}) {
  const totalBidsCount = bidderHistory?.reduce((acc, curr) => acc + Number(curr.countBids), 0) || 0;
  const nounSVG = createNounSVG(largestBid?.noun as Noun);

  return (
    <div className="content">
      <Stack direction="column" gap={1}>
        <Text variant="title-1" bold color="low-text">
          Bidder Strength
        </Text>
        <Text variant="title-2" bold color="low-text">
          <Text variant="title-2" bold color="yellow">
            {wins >= 3 ? '★★★' : wins >= 1 ? '★★' : '★'}
          </Text>
          &nbsp;
          <Text variant="title-2" bold color="low-text">
            •&nbsp;{wins >= 3 ? 'Strong Bidder' : wins >= 1 ? 'Medium Bidder' : 'Weak Bidder'}
          </Text>
        </Text>
        <Text variant="body" color="low-text">
          <span style={{ lineHeight: 'var(--s1)' }}>
            Based on total wallet worth, total nouns held, number of previous rounds lost, and
            others factors.
          </span>
        </Text>
      </Stack>
      <HorizontalLine />
      <Stack direction="column" gap={-1}>
        <span style={{ whiteSpace: 'pre' }}>
          <Text variant="title-2" bold color="green">
            {`${wins} ${wins > 1 ? 'Nouns' : 'Noun'} won`}
          </Text>
          <Text variant="title-2" bold color="mid-text">
            &nbsp;•&nbsp;{`from ${totalBidsCount} ${totalBidsCount > 1 ? 'bids' : 'bid'}`}
          </Text>
        </span>
        {bidderHistory && bidderHistory.length > 0 ? (
          <>
            <span className="bidder-history">
              <Text variant="body" color={'bright-text'}>
                {bidderHistory.map((activity, index) => (
                  <span key={index}>
                    <Link
                      href={`/noun/${activity.auctionId}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        color:
                          activity.winner === address ? 'var(--bright-text)' : 'var(--low-text)',
                        lineHeight: 'var(--s1)',
                      }}
                    >
                      {activity.auctionId}
                    </Link>
                    {bidderHistory.length - 1 === index ? '' : ', '}
                  </span>
                ))}
              </Text>
            </span>
          </>
        ) : (
          <EmptySection height="6rem" />
        )}
        <HorizontalLine />
        <Stack direction="column" gap={2}>
          <Stack direction="column" gap={0}>
            <Text variant="title-1" bold color="low-text">
              Largest bid:
            </Text>
            {largestBid ? (
              <Text variant="large-title" bold color="low-text">
                <Text variant="large-title" bold color="yellow">
                  {formatEther(BigInt(largestBid?.value || '0'))}
                </Text>
                &nbsp;•&nbsp;
                <Text variant="large-title" bold color="bright-text">
                  <Link target="_blank" rel="noreferrer" href={`/noun/${largestBid?.id}`}>
                    Noun&nbsp;{`#${largestBid?.id}`}
                  </Link>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={`https://opensea.io/assets/ethereum/0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03/${largestBid?.id}`}
                  >
                    <img
                      src={nounSVG}
                      alt={`Noun ${largestBid?.id}`}
                      style={{ width: '24px' }}
                      className="hide-on-mobile"
                    />
                  </Link>
                </Text>
              </Text>
            ) : (
              <EmptySection height="3rem" />
            )}
          </Stack>
          <Stack direction="column" gap={0}>
            <Text variant="title-1" bold color="low-text">
              Recent Activity:
            </Text>
            {bidderHistory && bidderHistory.length > 0 ? (
              <div className="activity-table">
                <table>
                  <tbody>
                    {bidderHistory
                      .sort((a, b) => b.auctionId - a.auctionId)
                      .map((activity, index) => (
                        <tr key={index}>
                          <td>
                            <Link
                              href={`/noun/${activity.auctionId}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              #{activity.auctionId}
                            </Link>
                          </td>
                          <td className="dot">•</td>
                          <td>{formatBalance(BigInt(activity.maxBid))}</td>
                          <td className="dot">•</td>
                          <td>{`${activity.countBids} ${Number(activity.countBids) > 1 ? 'bids' : 'bid'}`}</td>
                          <td className="dot">•</td>
                          <td
                            style={{
                              color: `${activity.winner === address ? 'var(--green)' : 'var(--red)'}`,
                            }}
                          >
                            {activity.winner === address ? 'WON' : 'LOST'}
                          </td>
                          <td style={{ color: 'var(--low-text)', textAlign: 'right' }}>
                            <span suppressHydrationWarning>
                              {formatTime(Number(activity.latestBidTime) * 1000)}
                              <span className="hide-on-mobile">&nbsp;ago</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptySection height="6rem" />
            )}
          </Stack>
        </Stack>
      </Stack>
      <style jsx>{`
        .content {
          padding: 0 var(--s1) 0;
        }
        .bidder-history {
          height: 3rem;
          overflow-y: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          color: var(--bright-text);
          font-weight: 600;
          font-size: 1.1rem;
          white-space: nowrap;
        }
        .activity-table {
          height: 6rem;
          overflow-y: auto;
        }
        .dot {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 20px;
          color: var(--low-text);
        }

        @media only screen and (max-width: 600px) {
          .hide-on-mobile {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

function EmptySection({ height }: { height: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'var(--low-text)',
        height: height,
      }}
    >
      Empty
    </div>
  );
}

function HorizontalLine() {
  return (
    <>
      <div className="hr" />
      <style jsx>{`
        .hr {
          height: 1px;
          background-color: var(--lines);
          margin: var(--s1) 0;
        }
      `}</style>
    </>
  );
}

function LiveLine({ text }: { text: string }) {
  return (
    <div className="live">
      <div className="content">{text.repeat(50)}</div>
      <style jsx>{`
        .live {
          overflow: hidden;
          white-space: nowrap;
        }
        .content {
          animation: 60s scroll infinite linear;
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-1000px);
          }
        }
      `}</style>
    </div>
  );
}

function parseAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-5)}`;
}

function formatUsdPrice(amount: number) {
  const bigint = BigInt(Math.floor(amount));
  const num = formatEther(bigint);

  const formatted = Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return '$' + formatted;
}

function createNounSVG(noun: Noun, isBackground?: boolean): string {
  if (!noun) {
    return '';
  }

  try {
    const data = getNounData(noun);
    const { parts, background } = data;

    let svgBinary;

    if (isBackground) {
      svgBinary = buildSVG(parts, ImageData.palette, background);
    } else {
      svgBinary = buildSVG(parts, ImageData.palette);
    }

    return 'data:image/svg+xml;base64,' + btoa(svgBinary);
  } catch (e) {
    console.error(e);
    return '';
  }
}

function formatTime(lastActivity: number) {
  const pad2 = (n: number) => n.toString().padStart(2, ' ');
  const delta = Date.now() - lastActivity;
  const years = Math.floor(delta / (60 * 60 * 24 * 365 * 1000));
  const months = Math.floor(delta / (60 * 60 * 24 * 30 * 1000));
  const days = Math.floor(delta / (24 * 60 * 60 * 1000));
  const hours = Math.floor(delta / (60 * 60 * 1000));

  if (hours < 24) {
    return `${pad2(hours)}h`;
  } else if (days < 30) {
    return `${pad2(days)}d`;
  } else if (months < 12) {
    return `${pad2(months)}m`;
  }

  return `${pad2(years)}y`;
}

function formatBalance(balance: bigint, prefix = 'Ξ') {
  let [a, b] = formatEther(balance).split('.');
  if (!b) {
    b = '0';
  }
  if (b.length > 2) {
    b = b.substring(0, 2);
  }

  if (a == '0' && b == '00') {
    prefix = '<';
    b = '01';
  }

  return (
    <>
      {prefix}
      {a}
      <small style={{ opacity: 0.5 }}>.{b}</small>
    </>
  );
}
