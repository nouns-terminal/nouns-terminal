import { BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { FormEvent, useRef, useState } from 'react';

type Props = {
  currentBid: BigNumber;
  onSubmitBid: (newBid: BigNumber) => Promise<void>;
};

export default function Bidding({ currentBid, onSubmitBid }: Props) {
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
    if (currentBid.eq(0)) {
      return;
    }
    // TODO: make the bid "pretty", remove trailing ".0", round up to 3 digits
    const newBid = currentBid.add(currentBid.mul(percentagePoints).div(100));
    setText(formatEther(newBid));
    inputRef.current?.focus();
  };

  const isValidBid = !isNaN(Number(text)) && Number(text) > 0;

  return (
    <div className="container">
      <button className="option" onClick={() => handleBump(5)}>
        +5%
      </button>
      <button className="option" onClick={() => handleBump(10)}>
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
        <button>Place Bid</button>
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
          background-color: ${isValidBid ? 'var(--yellow)' : 'var(--hint-text)'};
          color: ${isValidBid ? 'var(--surface-bg)' : 'var(--yellow)'};
          border: solid 1px ${isValidBid ? 'var(--yellow)' : 'var(--hint-text)'};
          cursor: ${isValidBid ? 'pointer' : 'arrow'};
          outline: none;
        }
        form button:hover {
          background-color: ${isValidBid ? 'var(--light-yellow)' : 'var(--hint-text)'};
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
      `}</style>
    </div>
  );
}
