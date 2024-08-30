import { formatEther, parseEther } from 'viem';
import { FormEvent, useRef, useState } from 'react';

type Props = {
  currentBid: bigint;
  onSubmitBid: (newBid: bigint) => Promise<unknown>;
  isLoading?: boolean;
};

export default function Bidding({ currentBid, onSubmitBid, isLoading }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const newBid = parseEther(text);
      await onSubmitBid(newBid);
      setText('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleBump = (percentagePoints: number) => {
    if (currentBid == 0n) {
      currentBid = parseEther('0.01');
    }
    // TODO: make the bid "pretty", remove trailing ".0", round up to 3 digits
    const newBid = currentBid + (currentBid * BigInt(percentagePoints)) / 100n;
    setText(formatEther(newBid));
    inputRef.current?.focus();
  };

  const isValidBid = !isNaN(Number(text)) && Number(text) > 0;

  return (
    <div className="container">
      <button data-umami-event="Plus 2%" className="option" onClick={() => handleBump(2)}>
        +2%
      </button>
      <button data-umami-event="Plus 10%" className="option" onClick={() => handleBump(10)}>
        +10%
      </button>
      <form onSubmit={handleSubmit} onClick={() => inputRef.current?.focus()}>
        <div className="ether">Ξ</div>
        <input
          ref={inputRef}
          type="text"
          placeholder="00"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {isLoading ? (
          <button className="isLoading" disabled>
            Waiting…&nbsp;
          </button>
        ) : (
          <button data-umami-event="Place Bid" disabled={!isValidBid}>
            Place&nbsp;Bid
          </button>
        )}
      </form>
      <style jsx>{`
        .container {
          display: flex;
          gap: var(--s-2);
        }
        form {
          border: 1px solid ${isValidBid ? 'var(--yellow)' : 'var(--hint-text)'};
          display: flex;
        }
        form .ether {
          align-self: center;
          padding: 0px var(--s-1);
          color: var(--hint-text);
        }
        form input {
          background: transparent;
          border: none;
          outline: none;
          padding: var(--s-2);
          text-align: right;
          width: 8ch;
          font-size: calc(max(1rem, 16px));
        }
        form button {
          padding: var(--s-2) var(--s1);
          background-color: ${!isLoading && isValidBid ? 'var(--yellow)' : 'var(--hint-text)'};
          color: ${!isLoading && isValidBid ? 'var(--surface-bg)' : 'var(--yellow)'};
          border: solid 1px ${!isLoading && isValidBid ? 'var(--yellow)' : 'var(--hint-text)'};
          cursor: ${!isLoading && isValidBid ? 'pointer' : 'arrow'};
          outline: none;
        }
        form button:hover {
          background-color: ${!isLoading && isValidBid
            ? 'var(--light-yellow)'
            : 'var(--hint-text)'};
        }
        .option {
          border: 1px solid var(--lines);
          padding: var(--s-2) var(--s-1);
          background: transparent;
          color: var(--mid-text);
          outline: none;
        }
        .option:hover {
          border-color: var(--yellow);
          color: var(--yellow);
          cursor: pointer;
        }
        @keyframes pulse {
          50% {
            opacity: 0.5;
          }
        }
        .isLoading {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
