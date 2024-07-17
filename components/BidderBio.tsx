import React, { useState } from 'react';
import { textStyle } from './Text';
import { Wallet } from '../server/api/types';
import { useAccount, useSignMessage } from 'wagmi';
import { verifyMessage } from '@wagmi/core';
import { trpc } from '../utils/trpc';
import { config } from '../utils/utils';

export default function BidderBio({ bidder }: { bidder: Wallet }) {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const mutation = trpc.author.insertBio.useMutation();
  const author = trpc.walletData.useQuery({
    address: address?.toLowerCase() || '',
  });

  const [bio, setBio] = useState(bidder.bioText || '');
  const [message, setMessage] = useState<{ text: string; isSuccess: boolean } | null>(null);

  let isAuthor = false;

  if (bidder.address === address?.toLowerCase()) {
    isAuthor = true;
  } else {
    isAuthor = author.data?.details?.isAuthor || false;
  }

  const signAction = async () => {
    try {
      const signature = await signMessageAsync({ message: bio });
      if (signature) {
        const isValid = await verifyMessage(config, {
          address: address || '0x',
          message: bio,
          signature,
        });
        if (isValid) {
          await mutation.mutateAsync({
            wallet: {
              address: author.data?.details.address || '0x',
              isAuthor,
            },
            bidderAddress: bidder.address.toString().toLowerCase(),
            bioText: bio,
          });
          setMessage({ text: 'Bio added.', isSuccess: true });
        } else {
          setMessage({ text: 'Validation failed.', isSuccess: false });
        }
      }
    } catch (error) {
      setMessage({ text: 'Fail to perform the action. Try again.', isSuccess: false });
    }
  };

  return (
    <>
      {author.isSuccess && (
        <div className="container">
          <div className="content">
            <textarea
              className="input-area"
              defaultValue={bio}
              disabled={!isAuthor}
              onChange={(el) => setBio(el.target.value.trim())}
            />
            {isAuthor && (
              <div className="button-container">
                <button
                  className="save-btn"
                  type="button"
                  onClick={signAction}
                  disabled={bio.length < 1}
                >
                  Save
                </button>
              </div>
            )}
          </div>
          <div style={{ margin: 'var(--s3) 0', height: 'var(--s1)' }}>
            {message && (
              <span
                style={{
                  color: message.isSuccess ? 'var(--green)' : 'var(--red)',
                }}
              >
                {message.text}
              </span>
            )}
          </div>
        </div>
      )}
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 90vh;
          width: 100%;
        }
        .content {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--lines);
          width: 50vw;
          height: 50vh;
          padding: var(--s1);
        }
        .input-area {
          width: 100%;
          height: 100%;
          background-color: var(--dark-bg);
          outline: none;
          resize: none;
          border: none;
          margin-bottom: var(--s1);
        }
        button {
          color: var(--bright-text);
          gap: var(--s-1);
          align-items: center;
          border: none;
          background: none;
          cursor: pointer;
        }
        .save-btn {
          background-color: var(--yellow);
          border: 1px solid var(--yellow);
          padding: var(--s-1) var(--s1);
          cursor: pointer;
          ${textStyle({ variant: 'title-2', bold: true, color: 'dark-bg' })}
          width: var(--s5);
        }
        .save-btn:hover {
          background-color: var(--light-yellow);
        }
        .save-btn:disabled {
          background-color: var(--low-text);
          border: 1px solid var(--low-text);
          cursor: default;
        }
        .button-container {
          display: flex;
          justify-content: flex-end;
        }
        @media only screen and (max-width: 950px) {
          .content {
            width: 90vw;
            height: 60vh;
          }
        }
      `}</style>
    </>
  );
}
