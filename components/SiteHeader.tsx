import Link from 'next/link';
import Text, { textStyle } from './Text';
// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ConnectKitButton } from 'connectkit';
import { Icon } from './BidsTable';

export default function SiteHeader() {
  return (
    <div className="container">
      <Text variant="title-1" bold color="yellow">
        <Link href="/">nouns.sh</Link>
      </Text>
      <Text variant="title-3" bold>
        <ConnectKitButton.Custom>
          {({ isConnected, isConnecting, show, hide, address, ensName, unsupported }) => {
            return (
              <div>
                {(() => {
                  if (!isConnected) {
                    return (
                      <button className="connect-wallet" onClick={show} type="button">
                        Connect Wallet
                      </button>
                    );
                  }

                  if (unsupported) {
                    return (
                      <button className="connect-wallet" onClick={show} type="button">
                        Connect Wallet
                      </button>
                    );
                  }

                  return (
                    <div className="account">
                      {/* {account.displayBalance && (
                        <>
                          <Text variant="title-3" bold>
                            {account.displayBalance}
                          </Text>
                          <Text variant="title-3" bold>
                            -
                          </Text>
                        </>
                      )} */}
                      <button onClick={show} type="button">
                        {address && <Icon address={address} />}
                        <Text variant="title-3" bold>
                          {ensName}
                        </Text>
                        <Chevron />
                      </button>
                    </div>
                  );
                })()}
              </div>
            );
          }}
        </ConnectKitButton.Custom>
      </Text>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: var(--s-2) var(--s1);
          border-bottom: solid 1px var(--lines);
        }
        .container button {
          border: 1px solid var(--yellow);
          padding: var(--s-1) var(--s1);
          cursor: pointer;
          ${textStyle({ variant: 'title-2', bold: true, color: 'dark-bg' })}
        }
        .connect-wallet {
          background-color: var(--yellow);
        }
        .connect-wallet:hover {
          background-color: var(--light-yellow);
        }
        .wrong-network {
          border-color: var(--red);
          background-color: var(--red);
        }
        .wrong-network:hover {
          background-color: var(--light-red);
        }
        .account {
          display: flex;
          gap: var(--s0);
          align-items: center;
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
      `}</style>
    </div>
  );
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
