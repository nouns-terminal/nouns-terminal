/** Types generated for queries found in "server/indexers/queries.sql" */
import { PreparedQuery } from '@pgtyped/query';

/** 'GetAuctionLastQueriedBlock' parameters type */
export type IGetAuctionLastQueriedBlockParams = void;

/** 'GetAuctionLastQueriedBlock' return type */
export interface IGetAuctionLastQueriedBlockResult {
  value: number | null;
}

/** 'GetAuctionLastQueriedBlock' query type */
export interface IGetAuctionLastQueriedBlockQuery {
  params: IGetAuctionLastQueriedBlockParams;
  result: IGetAuctionLastQueriedBlockResult;
}

const getAuctionLastQueriedBlockIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT \"value\" FROM \"state\" WHERE \"key\" = 'auction_last_queried_block' LIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT "value" FROM "state" WHERE "key" = 'auction_last_queried_block' LIMIT 1
 * ```
 */
export const getAuctionLastQueriedBlock = new PreparedQuery<IGetAuctionLastQueriedBlockParams,IGetAuctionLastQueriedBlockResult>(getAuctionLastQueriedBlockIR);


/** 'SetAuctionLastQueriedBlock' parameters type */
export interface ISetAuctionLastQueriedBlockParams {
  lastBlockNumber: number;
}

/** 'SetAuctionLastQueriedBlock' return type */
export type ISetAuctionLastQueriedBlockResult = void;

/** 'SetAuctionLastQueriedBlock' query type */
export interface ISetAuctionLastQueriedBlockQuery {
  params: ISetAuctionLastQueriedBlockParams;
  result: ISetAuctionLastQueriedBlockResult;
}

const setAuctionLastQueriedBlockIR: any = {"usedParamSet":{"lastBlockNumber":true},"params":[{"name":"lastBlockNumber","required":true,"transform":{"type":"scalar"},"locs":[{"a":75,"b":91},{"a":173,"b":189}]}],"statement":"INSERT INTO \"state\" (\"key\", \"value\")\nVALUES ('auction_last_queried_block', :lastBlockNumber!::INTEGER)\nON CONFLICT (\"key\") DO UPDATE SET\n\"value\" = GREATEST(\"state\".\"value\", :lastBlockNumber!::INTEGER)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "state" ("key", "value")
 * VALUES ('auction_last_queried_block', :lastBlockNumber!::INTEGER)
 * ON CONFLICT ("key") DO UPDATE SET
 * "value" = GREATEST("state"."value", :lastBlockNumber!::INTEGER)
 * ```
 */
export const setAuctionLastQueriedBlock = new PreparedQuery<ISetAuctionLastQueriedBlockParams,ISetAuctionLastQueriedBlockResult>(setAuctionLastQueriedBlockIR);


/** 'FindBidsWithMissingTransactions' parameters type */
export interface IFindBidsWithMissingTransactionsParams {
  limit: number;
}

/** 'FindBidsWithMissingTransactions' return type */
export interface IFindBidsWithMissingTransactionsResult {
  block: number;
  tx: string;
}

/** 'FindBidsWithMissingTransactions' query type */
export interface IFindBidsWithMissingTransactionsQuery {
  params: IFindBidsWithMissingTransactionsParams;
  result: IFindBidsWithMissingTransactionsResult;
}

const findBidsWithMissingTransactionsIR: any = {"usedParamSet":{"limit":true},"params":[{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":70,"b":76}]}],"statement":"SELECT \"tx\", \"block\" FROM \"bid\" WHERE \"bid\".\"timestamp\" IS NULL LIMIT :limit!::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * SELECT "tx", "block" FROM "bid" WHERE "bid"."timestamp" IS NULL LIMIT :limit!::INTEGER
 * ```
 */
export const findBidsWithMissingTransactions = new PreparedQuery<IFindBidsWithMissingTransactionsParams,IFindBidsWithMissingTransactionsResult>(findBidsWithMissingTransactionsIR);


/** 'UpdateBidTransactionMetadata' parameters type */
export interface IUpdateBidTransactionMetadataParams {
  maxFeePerGas: string | null | void;
  timestamp: number | null | void;
  txHash: string | null | void;
}

/** 'UpdateBidTransactionMetadata' return type */
export type IUpdateBidTransactionMetadataResult = void;

/** 'UpdateBidTransactionMetadata' query type */
export interface IUpdateBidTransactionMetadataQuery {
  params: IUpdateBidTransactionMetadataParams;
  result: IUpdateBidTransactionMetadataResult;
}

const updateBidTransactionMetadataIR: any = {"usedParamSet":{"timestamp":true,"maxFeePerGas":true,"txHash":true},"params":[{"name":"timestamp","required":false,"transform":{"type":"scalar"},"locs":[{"a":31,"b":40}]},{"name":"maxFeePerGas","required":false,"transform":{"type":"scalar"},"locs":[{"a":63,"b":75}]},{"name":"txHash","required":false,"transform":{"type":"scalar"},"locs":[{"a":90,"b":96}]}],"statement":"UPDATE bid\nSET\n  \"timestamp\" = :timestamp, \n  \"maxFeePerGas\" = :maxFeePerGas\nWHERE \"tx\" = :txHash"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE bid
 * SET
 *   "timestamp" = :timestamp, 
 *   "maxFeePerGas" = :maxFeePerGas
 * WHERE "tx" = :txHash
 * ```
 */
export const updateBidTransactionMetadata = new PreparedQuery<IUpdateBidTransactionMetadataParams,IUpdateBidTransactionMetadataResult>(updateBidTransactionMetadataIR);


/** 'FindUnindexedWallets' parameters type */
export interface IFindUnindexedWalletsParams {
  limit: number;
}

/** 'FindUnindexedWallets' return type */
export interface IFindUnindexedWalletsResult {
  address: string;
}

/** 'FindUnindexedWallets' query type */
export interface IFindUnindexedWalletsQuery {
  params: IFindUnindexedWalletsParams;
  result: IFindUnindexedWalletsResult;
}

const findUnindexedWalletsIR: any = {"usedParamSet":{"limit":true},"params":[{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":144,"b":150}]}],"statement":"SELECT \"bid\".\"walletAddress\" as \"address\"\nFROM \"bid\"\nLEFT JOIN \"wallet\" ON \"bid\".\"walletAddress\" = \"wallet\".\"address\"\nWHERE \"ens\" IS NULL LIMIT :limit!::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * SELECT "bid"."walletAddress" as "address"
 * FROM "bid"
 * LEFT JOIN "wallet" ON "bid"."walletAddress" = "wallet"."address"
 * WHERE "ens" IS NULL LIMIT :limit!::INTEGER
 * ```
 */
export const findUnindexedWallets = new PreparedQuery<IFindUnindexedWalletsParams,IFindUnindexedWalletsResult>(findUnindexedWalletsIR);


/** 'UpdateWalletData' parameters type */
export interface IUpdateWalletDataParams {
  address: string;
  balanceEth: string;
  balanceWeth: string;
  ens: string;
  nouns: number;
}

/** 'UpdateWalletData' return type */
export type IUpdateWalletDataResult = void;

/** 'UpdateWalletData' query type */
export interface IUpdateWalletDataQuery {
  params: IUpdateWalletDataParams;
  result: IUpdateWalletDataResult;
}

const updateWalletDataIR: any = {"usedParamSet":{"address":true,"ens":true,"balanceEth":true,"balanceWeth":true,"nouns":true},"params":[{"name":"address","required":true,"transform":{"type":"scalar"},"locs":[{"a":86,"b":94}]},{"name":"ens","required":true,"transform":{"type":"scalar"},"locs":[{"a":97,"b":101},{"a":190,"b":193}]},{"name":"balanceEth","required":true,"transform":{"type":"scalar"},"locs":[{"a":104,"b":115},{"a":213,"b":223}]},{"name":"balanceWeth","required":true,"transform":{"type":"scalar"},"locs":[{"a":118,"b":130},{"a":244,"b":255}]},{"name":"nouns","required":true,"transform":{"type":"scalar"},"locs":[{"a":133,"b":139},{"a":270,"b":275}]}],"statement":"INSERT INTO \"wallet\" (\"address\", \"ens\", \"balanceEth\", \"balanceWeth\", \"nouns\")\nVALUES (:address!, :ens!, :balanceEth!, :balanceWeth!, :nouns!)\nON CONFLICT (\"address\") DO UPDATE SET\n  \"ens\" = :ens,\n  \"balanceEth\" = :balanceEth,\n  \"balanceWeth\" = :balanceWeth,\n  \"nouns\" = :nouns"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "wallet" ("address", "ens", "balanceEth", "balanceWeth", "nouns")
 * VALUES (:address!, :ens!, :balanceEth!, :balanceWeth!, :nouns!)
 * ON CONFLICT ("address") DO UPDATE SET
 *   "ens" = :ens,
 *   "balanceEth" = :balanceEth,
 *   "balanceWeth" = :balanceWeth,
 *   "nouns" = :nouns
 * ```
 */
export const updateWalletData = new PreparedQuery<IUpdateWalletDataParams,IUpdateWalletDataResult>(updateWalletDataIR);


/** 'InsertAuction' parameters type */
export interface IInsertAuctionParams {
  endTime: number;
  id: number;
  startTime: number;
}

/** 'InsertAuction' return type */
export type IInsertAuctionResult = void;

/** 'InsertAuction' query type */
export interface IInsertAuctionQuery {
  params: IInsertAuctionParams;
  result: IInsertAuctionResult;
}

const insertAuctionIR: any = {"usedParamSet":{"id":true,"startTime":true,"endTime":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":58,"b":61}]},{"name":"startTime","required":true,"transform":{"type":"scalar"},"locs":[{"a":64,"b":74}]},{"name":"endTime","required":true,"transform":{"type":"scalar"},"locs":[{"a":77,"b":85}]}],"statement":"INSERT INTO auction(\"id\", \"startTime\", \"endTime\")\nVALUES (:id!, :startTime!, :endTime!)\nON CONFLICT DO NOTHING"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO auction("id", "startTime", "endTime")
 * VALUES (:id!, :startTime!, :endTime!)
 * ON CONFLICT DO NOTHING
 * ```
 */
export const insertAuction = new PreparedQuery<IInsertAuctionParams,IInsertAuctionResult>(insertAuctionIR);


/** 'UpdateAuctionExtended' parameters type */
export interface IUpdateAuctionExtendedParams {
  endTime: number | null | void;
  id: number;
}

/** 'UpdateAuctionExtended' return type */
export type IUpdateAuctionExtendedResult = void;

/** 'UpdateAuctionExtended' query type */
export interface IUpdateAuctionExtendedQuery {
  params: IUpdateAuctionExtendedParams;
  result: IUpdateAuctionExtendedResult;
}

const updateAuctionExtendedIR: any = {"usedParamSet":{"endTime":true,"id":true},"params":[{"name":"endTime","required":false,"transform":{"type":"scalar"},"locs":[{"a":61,"b":68}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":99,"b":102}]}],"statement":"UPDATE auction\nSET \"endTime\" = GREATEST(\"auction\".\"endTime\", :endTime::INTEGER)\nWHERE auction.id = :id!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE auction
 * SET "endTime" = GREATEST("auction"."endTime", :endTime::INTEGER)
 * WHERE auction.id = :id!
 * ```
 */
export const updateAuctionExtended = new PreparedQuery<IUpdateAuctionExtendedParams,IUpdateAuctionExtendedResult>(updateAuctionExtendedIR);


/** 'UpdateAuctionSettled' parameters type */
export interface IUpdateAuctionSettledParams {
  id: number;
  price: string;
  winner: string;
}

/** 'UpdateAuctionSettled' return type */
export type IUpdateAuctionSettledResult = void;

/** 'UpdateAuctionSettled' query type */
export interface IUpdateAuctionSettledQuery {
  params: IUpdateAuctionSettledParams;
  result: IUpdateAuctionSettledResult;
}

const updateAuctionSettledIR: any = {"usedParamSet":{"winner":true,"price":true,"id":true},"params":[{"name":"winner","required":true,"transform":{"type":"scalar"},"locs":[{"a":30,"b":37}]},{"name":"price","required":true,"transform":{"type":"scalar"},"locs":[{"a":50,"b":56}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":77,"b":80}]}],"statement":"UPDATE auction\nSET \"winner\" = :winner!, \"price\" = :price!\nWHERE auction.id = :id!"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE auction
 * SET "winner" = :winner!, "price" = :price!
 * WHERE auction.id = :id!
 * ```
 */
export const updateAuctionSettled = new PreparedQuery<IUpdateAuctionSettledParams,IUpdateAuctionSettledResult>(updateAuctionSettledIR);


/** 'InsertAuctionBid' parameters type */
export interface IInsertAuctionBidParams {
  auctionId: number;
  block: number;
  extended: boolean;
  tx: string;
  value: string;
  walletAddress: string;
}

/** 'InsertAuctionBid' return type */
export type IInsertAuctionBidResult = void;

/** 'InsertAuctionBid' query type */
export interface IInsertAuctionBidQuery {
  params: IInsertAuctionBidParams;
  result: IInsertAuctionBidResult;
}

const insertAuctionBidIR: any = {"usedParamSet":{"tx":true,"auctionId":true,"walletAddress":true,"value":true,"block":true,"extended":true},"params":[{"name":"tx","required":true,"transform":{"type":"scalar"},"locs":[{"a":106,"b":109}]},{"name":"auctionId","required":true,"transform":{"type":"scalar"},"locs":[{"a":112,"b":122}]},{"name":"walletAddress","required":true,"transform":{"type":"scalar"},"locs":[{"a":125,"b":139}]},{"name":"value","required":true,"transform":{"type":"scalar"},"locs":[{"a":142,"b":148}]},{"name":"block","required":true,"transform":{"type":"scalar"},"locs":[{"a":154,"b":160}]},{"name":"extended","required":true,"transform":{"type":"scalar"},"locs":[{"a":163,"b":172}]}],"statement":"INSERT INTO bid(\"tx\", \"auctionId\", \"walletAddress\", \"value\", \"maxFeePerGas\", \"block\", \"extended\")\nVALUES (:tx!, :auctionId!, :walletAddress!, :value!, 0, :block!, :extended!)\nON CONFLICT DO NOTHING"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO bid("tx", "auctionId", "walletAddress", "value", "maxFeePerGas", "block", "extended")
 * VALUES (:tx!, :auctionId!, :walletAddress!, :value!, 0, :block!, :extended!)
 * ON CONFLICT DO NOTHING
 * ```
 */
export const insertAuctionBid = new PreparedQuery<IInsertAuctionBidParams,IInsertAuctionBidResult>(insertAuctionBidIR);


/** 'FindUnindexedNouns' parameters type */
export interface IFindUnindexedNounsParams {
  limit: number;
}

/** 'FindUnindexedNouns' return type */
export interface IFindUnindexedNounsResult {
  id: number;
}

/** 'FindUnindexedNouns' query type */
export interface IFindUnindexedNounsQuery {
  params: IFindUnindexedNounsParams;
  result: IFindUnindexedNounsResult;
}

const findUnindexedNounsIR: any = {"usedParamSet":{"limit":true},"params":[{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":146,"b":152}]}],"statement":"SELECT \"auction\".\"id\" as \"id\"\nFROM \"auction\"\nLEFT JOIN \"noun\" ON \"auction\".\"id\" = \"noun\".\"id\"\nWHERE \"background\" IS NULL\nORDER BY \"id\" DESC\nLIMIT :limit!::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * SELECT "auction"."id" as "id"
 * FROM "auction"
 * LEFT JOIN "noun" ON "auction"."id" = "noun"."id"
 * WHERE "background" IS NULL
 * ORDER BY "id" DESC
 * LIMIT :limit!::INTEGER
 * ```
 */
export const findUnindexedNouns = new PreparedQuery<IFindUnindexedNounsParams,IFindUnindexedNounsResult>(findUnindexedNounsIR);


/** 'UpdateNounSeeds' parameters type */
export interface IUpdateNounSeedsParams {
  accessory: number;
  background: number;
  body: number;
  glasses: number;
  head: number;
  id: number;
}

/** 'UpdateNounSeeds' return type */
export type IUpdateNounSeedsResult = void;

/** 'UpdateNounSeeds' query type */
export interface IUpdateNounSeedsQuery {
  params: IUpdateNounSeedsParams;
  result: IUpdateNounSeedsResult;
}

const updateNounSeedsIR: any = {"usedParamSet":{"id":true,"background":true,"body":true,"accessory":true,"head":true,"glasses":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":88,"b":91}]},{"name":"background","required":true,"transform":{"type":"scalar"},"locs":[{"a":94,"b":105},{"a":198,"b":209}]},{"name":"body","required":true,"transform":{"type":"scalar"},"locs":[{"a":108,"b":113},{"a":223,"b":228}]},{"name":"accessory","required":true,"transform":{"type":"scalar"},"locs":[{"a":116,"b":126},{"a":247,"b":257}]},{"name":"head","required":true,"transform":{"type":"scalar"},"locs":[{"a":129,"b":134},{"a":271,"b":276}]},{"name":"glasses","required":true,"transform":{"type":"scalar"},"locs":[{"a":137,"b":145},{"a":293,"b":301}]}],"statement":"INSERT INTO \"noun\" (\"id\", \"background\", \"body\", \"accessory\", \"head\", \"glasses\")\nVALUES (:id!, :background!, :body!, :accessory!, :head!, :glasses!)\nON CONFLICT (\"id\") DO UPDATE SET\n  \"background\" = :background!,\n  \"body\" = :body!,\n  \"accessory\" = :accessory!,\n  \"head\" = :head!,\n  \"glasses\" = :glasses!"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "noun" ("id", "background", "body", "accessory", "head", "glasses")
 * VALUES (:id!, :background!, :body!, :accessory!, :head!, :glasses!)
 * ON CONFLICT ("id") DO UPDATE SET
 *   "background" = :background!,
 *   "body" = :body!,
 *   "accessory" = :accessory!,
 *   "head" = :head!,
 *   "glasses" = :glasses!
 * ```
 */
export const updateNounSeeds = new PreparedQuery<IUpdateNounSeedsParams,IUpdateNounSeedsResult>(updateNounSeedsIR);


/** 'TotalNounsSupply' parameters type */
export type ITotalNounsSupplyParams = void;

/** 'TotalNounsSupply' return type */
export interface ITotalNounsSupplyResult {
  count: number | null;
}

/** 'TotalNounsSupply' query type */
export interface ITotalNounsSupplyQuery {
  params: ITotalNounsSupplyParams;
  result: ITotalNounsSupplyResult;
}

const totalNounsSupplyIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT (MAX(\"id\") - 1)::INTEGER AS count FROM \"auction\""};

/**
 * Query generated from SQL:
 * ```
 * SELECT (MAX("id") - 1)::INTEGER AS count FROM "auction"
 * ```
 */
export const totalNounsSupply = new PreparedQuery<ITotalNounsSupplyParams,ITotalNounsSupplyResult>(totalNounsSupplyIR);


