import { ExternalLinkIcon } from './Icons';
import { Noun, Social, WalletDetails } from '../server/api/types';
import React from 'react';
import Stack from './Stack';
import Text from './Text';
import { formatEther } from 'viem';
import Link from 'next/link';
import { createNounSVG, formatAddress } from '../utils/utils';
import HorizontalLine from './HorizontalLine';

export default function BidderProfileHeader({
  address,
  details,
  balance,
  nouns,
  domains,
  dapps,
}: {
  address: string;
  details: WalletDetails | undefined;
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
    ...(details?.ens ? [details?.ens] : []), // Only include ens if it exists
    ...(domains
      ?.filter((domain) => domain.nickname !== details?.ens)
      .map((domain) => domain.nickname) || []),
  ].join(' • ');

  return (
    <div style={{ backgroundColor: 'var(--dark-bg)' }}>
      <div className="content">
        <Stack direction="column" gap={-1}>
          <Text variant="large-title" bold color="bright-text">
            {formatAddress(address)}
            <a
              title={formatAddress(address)}
              target="_blank"
              rel="noreferrer"
              href={`https://etherscan.io/address/${address}`}
              className="external-link"
            >
              <ExternalLinkIcon />
            </a>
          </Text>
          <div className="social-info">
            <Text variant="headline" bold color="low-text">
              {domainNicknames.length < 42 ? (
                domainNicknames
              ) : (
                <LiveLine text={domainNicknames + ' • '} />
              )}
            </Text>
          </div>
          <div className="social-info">
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
              nounSVGs.map(
                (nounSVG, index) =>
                  nounSVG && (
                    <Link
                      href={`/noun/${nouns[index].id}`}
                      target="_blank"
                      rel="noreferrer"
                      key={index}
                    >
                      <img
                        src={nounSVG}
                        alt={`Noun ${nouns[index].id}`}
                        style={{ paddingBottom: 'var(--s-2)', width: '24px' }}
                        title={`Noun ${nouns[index].id}`}
                      />
                    </Link>
                  ),
              )}
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
          padding: var(--s1) var(--s2) 0 var(--s1);
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
          gap: var(--s-2);
          max-width: 50%;
          height: 6.5rem;
          overflow-y: auto;
        }
        .social-info {
          height: 1rem;
          maxwidth: 42ch;
          overflow: hidden;
          textoverflow: clip;
          whitespace: nowrap;
        }
        .social-link:hover {
          color: var(--bright-text);
        }
      `}</style>
      <HorizontalLine />
    </div>
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

function formatUsdPrice(amount: number) {
  const bigint = BigInt(Math.floor(amount));
  const num = formatEther(bigint);

  const formatted = Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return '$' + formatted;
}
