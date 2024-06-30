import { formatEther } from 'viem';

export function formatBalance(balance: bigint, prefix = 'Ξ') {
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
