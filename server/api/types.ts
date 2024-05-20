export type Vitals = {
  usdPrice: number;
  gasPriceInWei: string;
  treasuryBalanceInWei: string;
  adjustedTotalSupply: number;
};

export type Bid = {
  tx: string;
  walletAddress: string;
  value: string;
  extended: boolean;
  timestamp: number;
  maxFeePerGas: string;
  walletBalance: string | null;
};

export type Wallet = {
  address: string;
  ens: string | null;
  bids: number;
  nouns: number | null;
  wins: number | null;
};

export type Auction = {
  id: number;
  startTime: number;
  endTime: number;
  winner: string | null;
  price: string | null;
};

export type Noun = {
  id: number;
  background: number;
  body: number;
  accessory: number;
  head: number;
  glasses: number;
};

export type AuctionData = {
  auction: Auction;
  noun: Noun | null;
  bids: Bid[];
  wallets: Wallet[];
};
