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

export type WalletDetails = {
  address: string;
  ens: string | null;
  bids?: number;
  nouns?: number | null;
  wins?: number | null;
  bio?: string | null;
};

export type Balance = {
  eth: string;
  usd: string;
};

export type Wallet = {
  details: WalletDetails;
  balance: Balance;
  nouns: Noun[] | undefined;
  wins: { count: number | undefined };
  largestBid?: LargestBid;
  bidderHistory: BidderHistory[];
  domains: Social[];
  dapps: Social[];
};

export type LargestBid = {
  id: number;
  value: string;
  noun: Noun;
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
  url?: string;
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
  wallets: WalletDetails[];
  nounProperties: NounProperty[];
};

export type SlideOverContent =
  | {
      type: 'noun';
      id: number;
    }
  | { type: 'bidder'; address: string }
  | { type: 'menu' };

export type PriceStat = {
  id: number;
  price: string | null;
  startTime: number;
};

export type Prices = {
  threeMonthPriceStats: PriceStat[];
  halfYearPriceStats: PriceStat[];
  yearPriceStats: PriceStat[];
};

export type BidStat = {
  timestamp: number | null;
};

export type Bids = {
  threeMonthBidsStats: BidStat[];
  halfYearBidsStats: BidStat[];
  yearBidsStats: BidStat[];
};

export type GraphsData = {
  prices: Prices;
  bids: Bids;
};
