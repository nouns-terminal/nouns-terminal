import '@rainbow-me/rainbowkit/styles.css';
import Link from 'next/link';
import Text, { textStyle } from './Text';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Icon } from './BidsTable';
import { useEffect, useState } from 'react';

export default function SiteHeader() {
  return (
    <div className="container">
      <Text variant="title-1" bold color="yellow">
        <Link href="/">nouns.sh</Link>
      </Text>
      <Text variant="title-3" bold>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const isConnected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus || authenticationStatus === 'authenticated');
            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!isConnected) {
                    return (
                      <button
                        data-umami-event="Connect Wallet"
                        className="connect-wallet"
                        onClick={openConnectModal}
                        type="button"
                      >
                        Connect&nbsp;Wallet
                      </button>
                    );
                  }

                  return (
                    <div className="account">
                      <button
                        onClick={chain.unsupported ? openChainModal : openAccountModal}
                        type="button"
                      >
                        {account && <Icon address={account.address} />}
                        <Text variant="title-3" bold>
                          <div className="ens">
                            <ENSCache
                              key={account.address}
                              address={account.address}
                              ens={account.ensName}
                            />
                          </div>
                        </Text>
                        <Chevron />
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </Text>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          height: var(--s4);
          padding: var(--s-2) var(--s1);
          border-bottom: solid 1px var(--lines);
        }
        .ens {
          overflow: hidden;
          max-width: 15ch;
        }
        .account > button {
          color: var(--bright-text);
          display: flex;
          gap: var(--s-1);
          align-items: center;
          border: none;
          background: none;
          cursor: pointer;
        }
        .connect-wallet {
          background-color: var(--yellow);
          border: 1px solid var(--yellow);
          padding: var(--s-1) var(--s1);
          ${textStyle({ variant: 'title-2', bold: true, color: 'dark-bg' })}
          cursor: pointer;
        }
        .connect-wallet:hover {
          background-color: var(--light-yellow);
        }
        .account {
          display: flex;
          gap: var(--s0);
          align-items: center;
        }
        .wrong-network {
          border-color: var(--red);
          background-color: var(--red);
        }
        .wrong-network:hover {
          background-color: var(--light-red);
        }
      `}</style>
    </div>
  );
}

function ENSCache({ address, ens }: { address: string; ens?: string }) {
  const [cachedEns, setCachedEns] = useState(() => localStorage.getItem('nouns.sh-' + address));

  useEffect(() => {
    if (ens && ens !== cachedEns) {
      setCachedEns(ens);
      localStorage.setItem('nouns.sh-' + address, ens);
    }
  }, [ens, cachedEns, address]);

  return ens ?? cachedEns ?? address;
}

function Chevron() {
  return (
    <svg
      width="0.75em"
      height="0.75em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 15.9951C12.3418 15.9951 12.6289 15.8652 12.8955 15.5918L17.9541 10.417C18.1592 10.2119 18.2617 9.96582 18.2617 9.66504C18.2617 9.05664 17.7764 8.56445 17.1748 8.56445C16.8809 8.56445 16.6006 8.6875 16.375 8.91309L12.0068 13.4248L7.63184 8.91309C7.40625 8.6875 7.12598 8.56445 6.8252 8.56445C6.22363 8.56445 5.73828 9.05664 5.73828 9.66504C5.73828 9.95898 5.84082 10.2051 6.0459 10.417L11.1045 15.5918C11.3848 15.8721 11.665 15.9951 12 15.9951Z"
        fill="white"
      />
    </svg>
  );
}
