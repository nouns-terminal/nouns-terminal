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
  walletBalanceChange: string | null;
  clientId: number | null;
};

export type BidderHistory = {
  auctionId: number;
  countBids: string;
  latestBidTime: number;
  maxBid: string;
  winner: string | null;
};

export type Wallet = {
  address: string;
  ens: string | null;
  bids: number;
  nouns: number | null;
  wins: number | null;
};

export type Bidder = {
  ens: string | null;
  balance: { eth: string; usd: string } | null;
  nouns: Noun[] | null;
  largestBid: { auctionId: number; value: string } | null;
};

export type Activity = {
  id: number;
  maxBid: string;
  biddsAmount: number;
  date: number;
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
  owner: string | null;
};

export type Social = {
  type: string | null;
  nickname: string | null;
  followers: number | null;
};

export type NounProperty = {
  id: number;
  part: string;
  rarity: number;
};

export type AuctionData = {
  auction: Auction;
  noun: Noun | null;
  bids: Bid[];
  wallets: Wallet[];
  nounProperties: NounProperty[];
};

export type SlideOverContent =
  | {
      type: 'noun';
      noun: Noun | null;
      nounProperties: NounProperty[];
      nounSrc: string;
      winner: string;
      owner: string;
    }
  | { type: 'bidder'; address: string | null };
