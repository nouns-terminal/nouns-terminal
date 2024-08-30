/** Types generated for queries found in "server/db/queries.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type NumberOrString = number | string;

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


/** 'GetTransferLastQueriedBlock' parameters type */
export type IGetTransferLastQueriedBlockParams = void;

/** 'GetTransferLastQueriedBlock' return type */
export interface IGetTransferLastQueriedBlockResult {
  value: number | null;
}

/** 'GetTransferLastQueriedBlock' query type */
export interface IGetTransferLastQueriedBlockQuery {
  params: IGetTransferLastQueriedBlockParams;
  result: IGetTransferLastQueriedBlockResult;
}

const getTransferLastQueriedBlockIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT \"value\" FROM \"state\" WHERE \"key\" = 'transfer_last_queried_block' LIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT "value" FROM "state" WHERE "key" = 'transfer_last_queried_block' LIMIT 1
 * ```
 */
export const getTransferLastQueriedBlock = new PreparedQuery<IGetTransferLastQueriedBlockParams,IGetTransferLastQueriedBlockResult>(getTransferLastQueriedBlockIR);


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


/** 'SetTransferLastQueriedBlock' parameters type */
export interface ISetTransferLastQueriedBlockParams {
  lastBlockNumber: number;
}

/** 'SetTransferLastQueriedBlock' return type */
export type ISetTransferLastQueriedBlockResult = void;

/** 'SetTransferLastQueriedBlock' query type */
export interface ISetTransferLastQueriedBlockQuery {
  params: ISetTransferLastQueriedBlockParams;
  result: ISetTransferLastQueriedBlockResult;
}

const setTransferLastQueriedBlockIR: any = {"usedParamSet":{"lastBlockNumber":true},"params":[{"name":"lastBlockNumber","required":true,"transform":{"type":"scalar"},"locs":[{"a":76,"b":92},{"a":174,"b":190}]}],"statement":"INSERT INTO \"state\" (\"key\", \"value\")\nVALUES ('transfer_last_queried_block', :lastBlockNumber!::INTEGER)\nON CONFLICT (\"key\") DO UPDATE SET\n\"value\" = GREATEST(\"state\".\"value\", :lastBlockNumber!::INTEGER)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "state" ("key", "value")
 * VALUES ('transfer_last_queried_block', :lastBlockNumber!::INTEGER)
 * ON CONFLICT ("key") DO UPDATE SET
 * "value" = GREATEST("state"."value", :lastBlockNumber!::INTEGER)
 * ```
 */
export const setTransferLastQueriedBlock = new PreparedQuery<ISetTransferLastQueriedBlockParams,ISetTransferLastQueriedBlockResult>(setTransferLastQueriedBlockIR);


/** 'FindBidsWithMissingTransactions' parameters type */
export interface IFindBidsWithMissingTransactionsParams {
  limit: number;
}

/** 'FindBidsWithMissingTransactions' return type */
export interface IFindBidsWithMissingTransactionsResult {
  auctionId: number;
  block: number;
  tx: string;
  walletAddress: string;
}

/** 'FindBidsWithMissingTransactions' query type */
export interface IFindBidsWithMissingTransactionsQuery {
  params: IFindBidsWithMissingTransactionsParams;
  result: IFindBidsWithMissingTransactionsResult;
}

const findBidsWithMissingTransactionsIR: any = {"usedParamSet":{"limit":true},"params":[{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":126,"b":132}]}],"statement":"SELECT \"tx\", \"block\", \"auctionId\", \"walletAddress\" FROM \"bid\" WHERE \"bid\".\"timestamp\" IS NULL ORDER BY \"auctionId\" DESC LIMIT :limit!::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * SELECT "tx", "block", "auctionId", "walletAddress" FROM "bid" WHERE "bid"."timestamp" IS NULL ORDER BY "auctionId" DESC LIMIT :limit!::INTEGER
 * ```
 */
export const findBidsWithMissingTransactions = new PreparedQuery<IFindBidsWithMissingTransactionsParams,IFindBidsWithMissingTransactionsResult>(findBidsWithMissingTransactionsIR);


/** 'UpdateBidTransactionMetadata' parameters type */
export interface IUpdateBidTransactionMetadataParams {
  maxFeePerGas?: NumberOrString | null | void;
  timestamp?: number | null | void;
  txHash?: string | null | void;
  walletBalance?: NumberOrString | null | void;
}

/** 'UpdateBidTransactionMetadata' return type */
export type IUpdateBidTransactionMetadataResult = void;

/** 'UpdateBidTransactionMetadata' query type */
export interface IUpdateBidTransactionMetadataQuery {
  params: IUpdateBidTransactionMetadataParams;
  result: IUpdateBidTransactionMetadataResult;
}

const updateBidTransactionMetadataIR: any = {"usedParamSet":{"timestamp":true,"maxFeePerGas":true,"walletBalance":true,"txHash":true},"params":[{"name":"timestamp","required":false,"transform":{"type":"scalar"},"locs":[{"a":31,"b":40}]},{"name":"maxFeePerGas","required":false,"transform":{"type":"scalar"},"locs":[{"a":63,"b":75}]},{"name":"walletBalance","required":false,"transform":{"type":"scalar"},"locs":[{"a":98,"b":111}]},{"name":"txHash","required":false,"transform":{"type":"scalar"},"locs":[{"a":126,"b":132}]}],"statement":"UPDATE bid\nSET\n  \"timestamp\" = :timestamp, \n  \"maxFeePerGas\" = :maxFeePerGas,\n  \"walletBalance\" = :walletBalance\nWHERE \"tx\" = :txHash"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE bid
 * SET
 *   "timestamp" = :timestamp, 
 *   "maxFeePerGas" = :maxFeePerGas,
 *   "walletBalance" = :walletBalance
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
  address: string | null;
  auctionId: number | null;
}

/** 'FindUnindexedWallets' query type */
export interface IFindUnindexedWalletsQuery {
  params: IFindUnindexedWalletsParams;
  result: IFindUnindexedWalletsResult;
}

const findUnindexedWalletsIR: any = {"usedParamSet":{"limit":true},"params":[{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":494,"b":500}]}],"statement":"(\n  SELECT \n    \"bid\".\"auctionId\", \n    \"bid\".\"walletAddress\" as \"address\" \n  FROM \"bid\" \n  LEFT JOIN \"wallet\" \n    ON \"bid\".\"walletAddress\" = \"wallet\".\"address\" \n  WHERE \"wallet\".\"ens\" IS NULL AND \"bid\".\"walletAddress\" IS NOT NULL\n)\nUNION\n(\n  SELECT \n    NULL as \"auctionId\",\n    \"noun\".\"owner\" as \"address\"\n  FROM \"noun\"\n  LEFT JOIN \"wallet\"\n    ON \"noun\".\"owner\" = \"wallet\".\"address\"\n  WHERE \"wallet\".\"ens\" IS NULL AND \"noun\".\"owner\" IS NOT NULL\n)\nORDER BY \"auctionId\" DESC NULLS LAST\nLIMIT :limit!::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * (
 *   SELECT 
 *     "bid"."auctionId", 
 *     "bid"."walletAddress" as "address" 
 *   FROM "bid" 
 *   LEFT JOIN "wallet" 
 *     ON "bid"."walletAddress" = "wallet"."address" 
 *   WHERE "wallet"."ens" IS NULL AND "bid"."walletAddress" IS NOT NULL
 * )
 * UNION
 * (
 *   SELECT 
 *     NULL as "auctionId",
 *     "noun"."owner" as "address"
 *   FROM "noun"
 *   LEFT JOIN "wallet"
 *     ON "noun"."owner" = "wallet"."address"
 *   WHERE "wallet"."ens" IS NULL AND "noun"."owner" IS NOT NULL
 * )
 * ORDER BY "auctionId" DESC NULLS LAST
 * LIMIT :limit!::INTEGER
 * ```
 */
export const findUnindexedWallets = new PreparedQuery<IFindUnindexedWalletsParams,IFindUnindexedWalletsResult>(findUnindexedWalletsIR);


/** 'UpdateWalletData' parameters type */
export interface IUpdateWalletDataParams {
  address: string;
  ens: string;
}

/** 'UpdateWalletData' return type */
export type IUpdateWalletDataResult = void;

/** 'UpdateWalletData' query type */
export interface IUpdateWalletDataQuery {
  params: IUpdateWalletDataParams;
  result: IUpdateWalletDataResult;
}

const updateWalletDataIR: any = {"usedParamSet":{"address":true,"ens":true},"params":[{"name":"address","required":true,"transform":{"type":"scalar"},"locs":[{"a":48,"b":56}]},{"name":"ens","required":true,"transform":{"type":"scalar"},"locs":[{"a":59,"b":63},{"a":114,"b":117}]}],"statement":"INSERT INTO \"wallet\" (\"address\", \"ens\")\nVALUES (:address!, :ens!)\nON CONFLICT (\"address\") DO UPDATE SET\n  \"ens\" = :ens"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "wallet" ("address", "ens")
 * VALUES (:address!, :ens!)
 * ON CONFLICT ("address") DO UPDATE SET
 *   "ens" = :ens
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

const insertAuctionIR: any = {"usedParamSet":{"id":true,"startTime":true,"endTime":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":58,"b":61}]},{"name":"startTime","required":true,"transform":{"type":"scalar"},"locs":[{"a":64,"b":74}]},{"name":"endTime","required":true,"transform":{"type":"scalar"},"locs":[{"a":77,"b":85}]}],"statement":"INSERT INTO auction(\"id\", \"startTime\", \"endTime\")\nVALUES (:id!, :startTime!, :endTime!)\nON CONFLICT (\"id\") DO UPDATE SET\n  \"startTime\" = EXCLUDED.\"startTime\",\n  \"endTime\" = EXCLUDED.\"endTime\""};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO auction("id", "startTime", "endTime")
 * VALUES (:id!, :startTime!, :endTime!)
 * ON CONFLICT ("id") DO UPDATE SET
 *   "startTime" = EXCLUDED."startTime",
 *   "endTime" = EXCLUDED."endTime"
 * ```
 */
export const insertAuction = new PreparedQuery<IInsertAuctionParams,IInsertAuctionResult>(insertAuctionIR);


/** 'UpdateAuctionExtended' parameters type */
export interface IUpdateAuctionExtendedParams {
  endTime?: number | null | void;
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
  price: NumberOrString;
  winner: string;
}

/** 'UpdateAuctionSettled' return type */
export type IUpdateAuctionSettledResult = void;

/** 'UpdateAuctionSettled' query type */
export interface IUpdateAuctionSettledQuery {
  params: IUpdateAuctionSettledParams;
  result: IUpdateAuctionSettledResult;
}

const updateAuctionSettledIR: any = {"usedParamSet":{"id":true,"winner":true,"price":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":77,"b":80}]},{"name":"winner","required":true,"transform":{"type":"scalar"},"locs":[{"a":89,"b":96}]},{"name":"price","required":true,"transform":{"type":"scalar"},"locs":[{"a":99,"b":105}]}],"statement":"INSERT INTO auction(\"id\", \"startTime\", \"endTime\", \"winner\", \"price\")\nVALUES (:id!, 0, 0, :winner!, :price!)\nON CONFLICT (\"id\") DO UPDATE SET\n  \"winner\" = EXCLUDED.\"winner\",\n  \"price\" = EXCLUDED.\"price\""};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO auction("id", "startTime", "endTime", "winner", "price")
 * VALUES (:id!, 0, 0, :winner!, :price!)
 * ON CONFLICT ("id") DO UPDATE SET
 *   "winner" = EXCLUDED."winner",
 *   "price" = EXCLUDED."price"
 * ```
 */
export const updateAuctionSettled = new PreparedQuery<IUpdateAuctionSettledParams,IUpdateAuctionSettledResult>(updateAuctionSettledIR);


/** 'InsertAuctionBid' parameters type */
export interface IInsertAuctionBidParams {
  auctionId: number;
  block: number;
  extended: boolean;
  index: number;
  tx: string;
  value: NumberOrString;
  walletAddress: string;
}

/** 'InsertAuctionBid' return type */
export type IInsertAuctionBidResult = void;

/** 'InsertAuctionBid' query type */
export interface IInsertAuctionBidQuery {
  params: IInsertAuctionBidParams;
  result: IInsertAuctionBidResult;
}

const insertAuctionBidIR: any = {"usedParamSet":{"tx":true,"index":true,"auctionId":true,"walletAddress":true,"value":true,"block":true,"extended":true},"params":[{"name":"tx","required":true,"transform":{"type":"scalar"},"locs":[{"a":115,"b":118}]},{"name":"index","required":true,"transform":{"type":"scalar"},"locs":[{"a":121,"b":127}]},{"name":"auctionId","required":true,"transform":{"type":"scalar"},"locs":[{"a":130,"b":140}]},{"name":"walletAddress","required":true,"transform":{"type":"scalar"},"locs":[{"a":143,"b":157}]},{"name":"value","required":true,"transform":{"type":"scalar"},"locs":[{"a":160,"b":166}]},{"name":"block","required":true,"transform":{"type":"scalar"},"locs":[{"a":172,"b":178}]},{"name":"extended","required":true,"transform":{"type":"scalar"},"locs":[{"a":181,"b":190}]}],"statement":"INSERT INTO bid(\"tx\", \"index\", \"auctionId\", \"walletAddress\", \"value\", \"maxFeePerGas\", \"block\", \"extended\")\nVALUES (:tx!, :index!, :auctionId!, :walletAddress!, :value!, 0, :block!, :extended!)\nON CONFLICT DO NOTHING"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO bid("tx", "index", "auctionId", "walletAddress", "value", "maxFeePerGas", "block", "extended")
 * VALUES (:tx!, :index!, :auctionId!, :walletAddress!, :value!, 0, :block!, :extended!)
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
  accessory: number | null;
  background: number | null;
  body: number | null;
  glasses: number | null;
  head: number | null;
  id: number;
  owner: string | null;
}

/** 'FindUnindexedNouns' query type */
export interface IFindUnindexedNounsQuery {
  params: IFindUnindexedNounsParams;
  result: IFindUnindexedNounsResult;
}

const findUnindexedNounsIR: any = {"usedParamSet":{"limit":true},"params":[{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":73,"b":79}]}],"statement":"SELECT * FROM \"noun\" WHERE \"background\" IS NULL ORDER BY \"id\" DESC LIMIT :limit!::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM "noun" WHERE "background" IS NULL ORDER BY "id" DESC LIMIT :limit!::INTEGER
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


/** 'UpdateNounOwner' parameters type */
export interface IUpdateNounOwnerParams {
  id: number;
  owner: string;
}

/** 'UpdateNounOwner' return type */
export type IUpdateNounOwnerResult = void;

/** 'UpdateNounOwner' query type */
export interface IUpdateNounOwnerQuery {
  params: IUpdateNounOwnerParams;
  result: IUpdateNounOwnerResult;
}

const updateNounOwnerIR: any = {"usedParamSet":{"id":true,"owner":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":43,"b":46}]},{"name":"owner","required":true,"transform":{"type":"scalar"},"locs":[{"a":49,"b":55},{"a":103,"b":109}]}],"statement":"INSERT INTO \"noun\" (\"id\", \"owner\")\nVALUES (:id!, :owner!)\nON CONFLICT (\"id\") DO UPDATE SET\n  \"owner\" = :owner!"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "noun" ("id", "owner")
 * VALUES (:id!, :owner!)
 * ON CONFLICT ("id") DO UPDATE SET
 *   "owner" = :owner!
 * ```
 */
export const updateNounOwner = new PreparedQuery<IUpdateNounOwnerParams,IUpdateNounOwnerResult>(updateNounOwnerIR);


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


/** 'GetLatestAuction' parameters type */
export type IGetLatestAuctionParams = void;

/** 'GetLatestAuction' return type */
export interface IGetLatestAuctionResult {
  endTime: number;
  id: number;
  price: string | null;
  startTime: number;
  winner: string | null;
}

/** 'GetLatestAuction' query type */
export interface IGetLatestAuctionQuery {
  params: IGetLatestAuctionParams;
  result: IGetLatestAuctionResult;
}

const getLatestAuctionIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM \"auction\" ORDER BY \"id\" DESC LIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM "auction" ORDER BY "id" DESC LIMIT 1
 * ```
 */
export const getLatestAuction = new PreparedQuery<IGetLatestAuctionParams,IGetLatestAuctionResult>(getLatestAuctionIR);


/** 'GetLatestAuctionId' parameters type */
export interface IGetLatestAuctionIdParams {
  offset: number;
}

/** 'GetLatestAuctionId' return type */
export interface IGetLatestAuctionIdResult {
  id: number;
}

/** 'GetLatestAuctionId' query type */
export interface IGetLatestAuctionIdQuery {
  params: IGetLatestAuctionIdParams;
  result: IGetLatestAuctionIdResult;
}

const getLatestAuctionIdIR: any = {"usedParamSet":{"offset":true},"params":[{"name":"offset","required":true,"transform":{"type":"scalar"},"locs":[{"a":57,"b":64}]}],"statement":"SELECT \"id\" FROM auction ORDER BY id DESC LIMIT 1 OFFSET :offset!::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * SELECT "id" FROM auction ORDER BY id DESC LIMIT 1 OFFSET :offset!::INTEGER
 * ```
 */
export const getLatestAuctionId = new PreparedQuery<IGetLatestAuctionIdParams,IGetLatestAuctionIdResult>(getLatestAuctionIdIR);


/** 'GetAuctionById' parameters type */
export interface IGetAuctionByIdParams {
  id: number;
}

/** 'GetAuctionById' return type */
export interface IGetAuctionByIdResult {
  endTime: number;
  id: number;
  price: string | null;
  startTime: number;
  winner: string | null;
}

/** 'GetAuctionById' query type */
export interface IGetAuctionByIdQuery {
  params: IGetAuctionByIdParams;
  result: IGetAuctionByIdResult;
}

const getAuctionByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":85,"b":88}]}],"statement":"SELECT \"id\", \"startTime\", \"endTime\", \"winner\", \"price\"::TEXT FROM auction WHERE id = :id!::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * SELECT "id", "startTime", "endTime", "winner", "price"::TEXT FROM auction WHERE id = :id!::INTEGER
 * ```
 */
export const getAuctionById = new PreparedQuery<IGetAuctionByIdParams,IGetAuctionByIdResult>(getAuctionByIdIR);


/** 'GetNounById' parameters type */
export interface IGetNounByIdParams {
  id: number;
}

/** 'GetNounById' return type */
export interface IGetNounByIdResult {
  accessory: number | null;
  background: number | null;
  body: number | null;
  glasses: number | null;
  head: number | null;
  id: number;
  owner: string | null;
}

/** 'GetNounById' query type */
export interface IGetNounByIdQuery {
  params: IGetNounByIdParams;
  result: IGetNounByIdResult;
}

const getNounByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":30,"b":33}]}],"statement":"SELECT * FROM noun WHERE id = :id!::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM noun WHERE id = :id!::INTEGER
 * ```
 */
export const getNounById = new PreparedQuery<IGetNounByIdParams,IGetNounByIdResult>(getNounByIdIR);


/** 'GetBidsByAuctionId' parameters type */
export interface IGetBidsByAuctionIdParams {
  id: number;
}

/** 'GetBidsByAuctionId' return type */
export interface IGetBidsByAuctionIdResult {
  clientId: number | null;
  extended: boolean;
  maxFeePerGas: string | null;
  timestamp: number | null;
  tx: string;
  value: string | null;
  walletAddress: string;
  walletBalance: string | null;
}

/** 'GetBidsByAuctionId' query type */
export interface IGetBidsByAuctionIdQuery {
  params: IGetBidsByAuctionIdParams;
  result: IGetBidsByAuctionIdResult;
}

const getBidsByAuctionIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":213,"b":216}]}],"statement":"SELECT\n  bid.\"tx\", \n  bid.\"walletAddress\", \n  bid.\"value\"::TEXT,\n  bid.\"walletBalance\"::TEXT,\n  bid.\"extended\",\n  bid.\"timestamp\",\n  bid.\"clientId\",\n  bid.\"maxFeePerGas\"::TEXT\nFROM\n  bid\nWHERE\n  bid.\"auctionId\" = :id!::INTEGER\nORDER BY\n  bid.value DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   bid."tx", 
 *   bid."walletAddress", 
 *   bid."value"::TEXT,
 *   bid."walletBalance"::TEXT,
 *   bid."extended",
 *   bid."timestamp",
 *   bid."clientId",
 *   bid."maxFeePerGas"::TEXT
 * FROM
 *   bid
 * WHERE
 *   bid."auctionId" = :id!::INTEGER
 * ORDER BY
 *   bid.value DESC
 * ```
 */
export const getBidsByAuctionId = new PreparedQuery<IGetBidsByAuctionIdParams,IGetBidsByAuctionIdResult>(getBidsByAuctionIdIR);


/** 'GetWalletsByAuctionId' parameters type */
export interface IGetWalletsByAuctionIdParams {
  id: number;
}

/** 'GetWalletsByAuctionId' return type */
export interface IGetWalletsByAuctionIdResult {
  address: string;
  bids: number | null;
  ens: string | null;
  nouns: number | null;
  wins: number | null;
}

/** 'GetWalletsByAuctionId' query type */
export interface IGetWalletsByAuctionIdQuery {
  params: IGetWalletsByAuctionIdParams;
  result: IGetWalletsByAuctionIdResult;
}

const getWalletsByAuctionIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":730,"b":733}]}],"statement":"WITH wins_count AS (\n    SELECT winner, COUNT(*) AS count \n    FROM auction \n    GROUP BY winner\n),\nbid_counts AS (\n    SELECT \"walletAddress\", COUNT(*) AS count\n    FROM bid\n    GROUP BY \"walletAddress\"\n),\nnouns_counts AS (\n    SELECT \"owner\", COUNT(*) AS count\n    FROM noun\n    GROUP BY \"owner\"\n)\nSELECT\n  b.\"walletAddress\" AS \"address\",\n  w.ens,\n  COALESCE(bc.count, 0)::INT AS \"bids\", \n  COALESCE(nc.count, 0)::INT AS \"nouns\",\n  COALESCE(wc.count, 0)::INT AS \"wins\"\nFROM\n  bid b\nJOIN\n  wallet w ON b.\"walletAddress\" = w.address\nLEFT JOIN\n  wins_count wc ON wc.winner = b.\"walletAddress\"\nLEFT JOIN\n  bid_counts bc ON bc.\"walletAddress\" = w.address\nLEFT JOIN\n  nouns_counts nc ON nc.\"owner\" = w.address\nWHERE\n  b.\"auctionId\" = :id!::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * WITH wins_count AS (
 *     SELECT winner, COUNT(*) AS count 
 *     FROM auction 
 *     GROUP BY winner
 * ),
 * bid_counts AS (
 *     SELECT "walletAddress", COUNT(*) AS count
 *     FROM bid
 *     GROUP BY "walletAddress"
 * ),
 * nouns_counts AS (
 *     SELECT "owner", COUNT(*) AS count
 *     FROM noun
 *     GROUP BY "owner"
 * )
 * SELECT
 *   b."walletAddress" AS "address",
 *   w.ens,
 *   COALESCE(bc.count, 0)::INT AS "bids", 
 *   COALESCE(nc.count, 0)::INT AS "nouns",
 *   COALESCE(wc.count, 0)::INT AS "wins"
 * FROM
 *   bid b
 * JOIN
 *   wallet w ON b."walletAddress" = w.address
 * LEFT JOIN
 *   wins_count wc ON wc.winner = b."walletAddress"
 * LEFT JOIN
 *   bid_counts bc ON bc."walletAddress" = w.address
 * LEFT JOIN
 *   nouns_counts nc ON nc."owner" = w.address
 * WHERE
 *   b."auctionId" = :id!::INTEGER
 * ```
 */
export const getWalletsByAuctionId = new PreparedQuery<IGetWalletsByAuctionIdParams,IGetWalletsByAuctionIdResult>(getWalletsByAuctionIdIR);


/** 'FindWalletsInLatestAuction' parameters type */
export type IFindWalletsInLatestAuctionParams = void;

/** 'FindWalletsInLatestAuction' return type */
export interface IFindWalletsInLatestAuctionResult {
  index: number;
  tx: string;
  walletAddress: string;
}

/** 'FindWalletsInLatestAuction' query type */
export interface IFindWalletsInLatestAuctionQuery {
  params: IFindWalletsInLatestAuctionParams;
  result: IFindWalletsInLatestAuctionResult;
}

const findWalletsInLatestAuctionIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT DISTINCT ON (bid.\"walletAddress\")\n    bid.\"tx\",\n    bid.\"index\",\n    bid.\"walletAddress\"\nFROM bid\nJOIN auction ON bid.\"auctionId\" = auction.id\nWHERE auction.\"winner\" IS NULL\nORDER BY bid.\"walletAddress\", bid.\"value\" DESC"};

/**
 * Query generated from SQL:
 * ```
 * SELECT DISTINCT ON (bid."walletAddress")
 *     bid."tx",
 *     bid."index",
 *     bid."walletAddress"
 * FROM bid
 * JOIN auction ON bid."auctionId" = auction.id
 * WHERE auction."winner" IS NULL
 * ORDER BY bid."walletAddress", bid."value" DESC
 * ```
 */
export const findWalletsInLatestAuction = new PreparedQuery<IFindWalletsInLatestAuctionParams,IFindWalletsInLatestAuctionResult>(findWalletsInLatestAuctionIR);


/** 'UpdateWalletsValuesInLatestAuction' parameters type */
export interface IUpdateWalletsValuesInLatestAuctionParams {
  index?: number | null | void;
  tx?: string | null | void;
  walletBalance?: NumberOrString | null | void;
}

/** 'UpdateWalletsValuesInLatestAuction' return type */
export type IUpdateWalletsValuesInLatestAuctionResult = void;

/** 'UpdateWalletsValuesInLatestAuction' query type */
export interface IUpdateWalletsValuesInLatestAuctionQuery {
  params: IUpdateWalletsValuesInLatestAuctionParams;
  result: IUpdateWalletsValuesInLatestAuctionResult;
}

const updateWalletsValuesInLatestAuctionIR: any = {"usedParamSet":{"walletBalance":true,"tx":true,"index":true},"params":[{"name":"walletBalance","required":false,"transform":{"type":"scalar"},"locs":[{"a":44,"b":57}]},{"name":"tx","required":false,"transform":{"type":"scalar"},"locs":[{"a":72,"b":74}]},{"name":"index","required":false,"transform":{"type":"scalar"},"locs":[{"a":96,"b":101}]}],"statement":"UPDATE \"public\".\"bid\"\nSET \"walletBalance\" = :walletBalance\nWHERE \"tx\" = :tx::TEXT AND \"index\" = :index::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "public"."bid"
 * SET "walletBalance" = :walletBalance
 * WHERE "tx" = :tx::TEXT AND "index" = :index::INTEGER
 * ```
 */
export const updateWalletsValuesInLatestAuction = new PreparedQuery<IUpdateWalletsValuesInLatestAuctionParams,IUpdateWalletsValuesInLatestAuctionResult>(updateWalletsValuesInLatestAuctionIR);


/** 'UpdateAuctionBidWithClientId' parameters type */
export interface IUpdateAuctionBidWithClientIdParams {
  auctionId?: number | null | void;
  clientId?: number | null | void;
  value: NumberOrString;
}

/** 'UpdateAuctionBidWithClientId' return type */
export type IUpdateAuctionBidWithClientIdResult = void;

/** 'UpdateAuctionBidWithClientId' query type */
export interface IUpdateAuctionBidWithClientIdQuery {
  params: IUpdateAuctionBidWithClientIdParams;
  result: IUpdateAuctionBidWithClientIdResult;
}

const updateAuctionBidWithClientIdIR: any = {"usedParamSet":{"clientId":true,"value":true,"auctionId":true},"params":[{"name":"clientId","required":false,"transform":{"type":"scalar"},"locs":[{"a":39,"b":47}]},{"name":"value","required":true,"transform":{"type":"scalar"},"locs":[{"a":74,"b":80}]},{"name":"auctionId","required":false,"transform":{"type":"scalar"},"locs":[{"a":100,"b":109}]}],"statement":"UPDATE \"public\".\"bid\"\nSET \"clientId\" = :clientId::INTEGER\nWHERE \"value\" = :value! AND \"auctionId\" = :auctionId::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE "public"."bid"
 * SET "clientId" = :clientId::INTEGER
 * WHERE "value" = :value! AND "auctionId" = :auctionId::INTEGER
 * ```
 */
export const updateAuctionBidWithClientId = new PreparedQuery<IUpdateAuctionBidWithClientIdParams,IUpdateAuctionBidWithClientIdResult>(updateAuctionBidWithClientIdIR);


/** 'GetNounPropertiesById' parameters type */
export interface IGetNounPropertiesByIdParams {
  id?: number | null | void;
}

/** 'GetNounPropertiesById' return type */
export interface IGetNounPropertiesByIdResult {
  id: number | null;
  part: string | null;
  rarity: number | null;
}

/** 'GetNounPropertiesById' query type */
export interface IGetNounPropertiesByIdQuery {
  params: IGetNounPropertiesByIdParams;
  result: IGetNounPropertiesByIdResult;
}

const getNounPropertiesByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":1129,"b":1131}]}],"statement":"WITH total_nouns AS (\n  SELECT COUNT(*) AS total_count\n  FROM public.noun\n),\nrarities AS (\n  SELECT \n    body AS \"id\", \n    'body' AS \"part\",\n    COUNT(*)::FLOAT / (SELECT total_count FROM total_nouns) AS rarity\n  FROM public.noun\n  GROUP BY body\n  UNION ALL\n  SELECT \n    accessory AS \"id\", \n    'accessory' AS \"part\",\n    COUNT(*)::FLOAT / (SELECT total_count FROM total_nouns) AS rarity\n  FROM public.noun\n  GROUP BY accessory\n  UNION ALL\n  SELECT \n    head AS \"id\", \n    'head' AS \"part\",\n    COUNT(*)::FLOAT / (SELECT total_count FROM total_nouns) AS rarity\n  FROM public.noun\n  GROUP BY head\n  UNION ALL\n  SELECT \n    glasses AS \"id\", \n    'glasses' AS \"part\",\n    COUNT(*)::FLOAT / (SELECT total_count FROM total_nouns) AS rarity\n  FROM public.noun\n  GROUP BY glasses\n)\nSELECT \n  r.\"part\",\n  r.\"id\",\n  r.rarity\nFROM \n  public.noun n\nJOIN \n  rarities r\nON \n  (r.\"part\" = 'background' AND r.\"id\" = n.background) OR\n  (r.\"part\" = 'body' AND r.\"id\" = n.body) OR\n  (r.\"part\" = 'accessory' AND r.\"id\" = n.accessory) OR\n  (r.\"part\" = 'head' AND r.\"id\" = n.head) OR\n  (r.\"part\" = 'glasses' AND r.\"id\" = n.glasses)\nWHERE \n  n.id = :id::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * WITH total_nouns AS (
 *   SELECT COUNT(*) AS total_count
 *   FROM public.noun
 * ),
 * rarities AS (
 *   SELECT 
 *     body AS "id", 
 *     'body' AS "part",
 *     COUNT(*)::FLOAT / (SELECT total_count FROM total_nouns) AS rarity
 *   FROM public.noun
 *   GROUP BY body
 *   UNION ALL
 *   SELECT 
 *     accessory AS "id", 
 *     'accessory' AS "part",
 *     COUNT(*)::FLOAT / (SELECT total_count FROM total_nouns) AS rarity
 *   FROM public.noun
 *   GROUP BY accessory
 *   UNION ALL
 *   SELECT 
 *     head AS "id", 
 *     'head' AS "part",
 *     COUNT(*)::FLOAT / (SELECT total_count FROM total_nouns) AS rarity
 *   FROM public.noun
 *   GROUP BY head
 *   UNION ALL
 *   SELECT 
 *     glasses AS "id", 
 *     'glasses' AS "part",
 *     COUNT(*)::FLOAT / (SELECT total_count FROM total_nouns) AS rarity
 *   FROM public.noun
 *   GROUP BY glasses
 * )
 * SELECT 
 *   r."part",
 *   r."id",
 *   r.rarity
 * FROM 
 *   public.noun n
 * JOIN 
 *   rarities r
 * ON 
 *   (r."part" = 'background' AND r."id" = n.background) OR
 *   (r."part" = 'body' AND r."id" = n.body) OR
 *   (r."part" = 'accessory' AND r."id" = n.accessory) OR
 *   (r."part" = 'head' AND r."id" = n.head) OR
 *   (r."part" = 'glasses' AND r."id" = n.glasses)
 * WHERE 
 *   n.id = :id::INTEGER
 * ```
 */
export const getNounPropertiesById = new PreparedQuery<IGetNounPropertiesByIdParams,IGetNounPropertiesByIdResult>(getNounPropertiesByIdIR);


/** 'GetAddressNouns' parameters type */
export interface IGetAddressNounsParams {
  address: string;
}

/** 'GetAddressNouns' return type */
export interface IGetAddressNounsResult {
  accessory: number | null;
  background: number | null;
  body: number | null;
  glasses: number | null;
  head: number | null;
  id: number;
}

/** 'GetAddressNouns' query type */
export interface IGetAddressNounsQuery {
  params: IGetAddressNounsParams;
  result: IGetAddressNounsResult;
}

const getAddressNounsIR: any = {"usedParamSet":{"address":true},"params":[{"name":"address","required":true,"transform":{"type":"scalar"},"locs":[{"a":92,"b":100}]}],"statement":"SELECT \"id\", \"background\", \"body\", \"accessory\", \"head\", \"glasses\" FROM noun WHERE \"owner\" = :address!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT "id", "background", "body", "accessory", "head", "glasses" FROM noun WHERE "owner" = :address!
 * ```
 */
export const getAddressNouns = new PreparedQuery<IGetAddressNounsParams,IGetAddressNounsResult>(getAddressNounsIR);


/** 'GetAddressWins' parameters type */
export interface IGetAddressWinsParams {
  address: string;
}

/** 'GetAddressWins' return type */
export interface IGetAddressWinsResult {
  count: string | null;
}

/** 'GetAddressWins' query type */
export interface IGetAddressWinsQuery {
  params: IGetAddressWinsParams;
  result: IGetAddressWinsResult;
}

const getAddressWinsIR: any = {"usedParamSet":{"address":true},"params":[{"name":"address","required":true,"transform":{"type":"scalar"},"locs":[{"a":44,"b":52}]}],"statement":"SELECT COUNT(*) FROM auction WHERE winner = :address!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(*) FROM auction WHERE winner = :address!
 * ```
 */
export const getAddressWins = new PreparedQuery<IGetAddressWinsParams,IGetAddressWinsResult>(getAddressWinsIR);


/** 'GetAddressLargestBid' parameters type */
export interface IGetAddressLargestBidParams {
  address: string;
}

/** 'GetAddressLargestBid' return type */
export interface IGetAddressLargestBidResult {
  accessory: number | null;
  auctionId: number;
  background: number | null;
  body: number | null;
  glasses: number | null;
  head: number | null;
  value: string;
}

/** 'GetAddressLargestBid' query type */
export interface IGetAddressLargestBidQuery {
  params: IGetAddressLargestBidParams;
  result: IGetAddressLargestBidResult;
}

const getAddressLargestBidIR: any = {"usedParamSet":{"address":true},"params":[{"name":"address","required":true,"transform":{"type":"scalar"},"locs":[{"a":261,"b":269},{"a":378,"b":386}]}],"statement":"SELECT \n    \"bid\".\"auctionId\",\n    \"bid\".\"value\",\n    \"noun\".\"accessory\",\n    \"noun\".\"body\",\n    \"noun\".\"background\",\n    \"noun\".\"glasses\",\n    \"noun\".\"head\"\nFROM \n    \"bid\"\nLEFT JOIN \"noun\" ON \"bid\".\"auctionId\" = \"noun\".\"id\"\nWHERE \n    \"bid\".\"walletAddress\" = :address!\n    AND \"bid\".\"value\" = (\n        SELECT MAX(\"value\") \n        FROM \"bid\" \n        WHERE \"walletAddress\" = :address!\n    )"};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *     "bid"."auctionId",
 *     "bid"."value",
 *     "noun"."accessory",
 *     "noun"."body",
 *     "noun"."background",
 *     "noun"."glasses",
 *     "noun"."head"
 * FROM 
 *     "bid"
 * LEFT JOIN "noun" ON "bid"."auctionId" = "noun"."id"
 * WHERE 
 *     "bid"."walletAddress" = :address!
 *     AND "bid"."value" = (
 *         SELECT MAX("value") 
 *         FROM "bid" 
 *         WHERE "walletAddress" = :address!
 *     )
 * ```
 */
export const getAddressLargestBid = new PreparedQuery<IGetAddressLargestBidParams,IGetAddressLargestBidResult>(getAddressLargestBidIR);


/** 'GetAddressBidsHistory' parameters type */
export interface IGetAddressBidsHistoryParams {
  address: string;
}

/** 'GetAddressBidsHistory' return type */
export interface IGetAddressBidsHistoryResult {
  auctionId: number;
  countBids: string | null;
  latestBidTime: number | null;
  maxBid: string | null;
  winner: string | null;
}

/** 'GetAddressBidsHistory' query type */
export interface IGetAddressBidsHistoryQuery {
  params: IGetAddressBidsHistoryParams;
  result: IGetAddressBidsHistoryResult;
}

const getAddressBidsHistoryIR: any = {"usedParamSet":{"address":true},"params":[{"name":"address","required":true,"transform":{"type":"scalar"},"locs":[{"a":308,"b":316}]}],"statement":"SELECT \n    \"bid\".\"auctionId\",\n    MAX(\"bid\".\"value\") AS \"maxBid\",\n    COUNT(\"bid\".\"walletAddress\") AS \"countBids\",\n    \"auction\".\"winner\" as \"winner\",\n    MAX(\"bid\".\"timestamp\") as \"latestBidTime\"\nFROM \n    \"bid\"\nLEFT JOIN \"auction\" on \"bid\".\"auctionId\" = \"auction\".\"id\" \nWHERE \n    \"bid\".\"walletAddress\" = :address!\nGROUP BY \n    \"bid\".\"auctionId\", \"auction\".\"winner\""};

/**
 * Query generated from SQL:
 * ```
 * SELECT 
 *     "bid"."auctionId",
 *     MAX("bid"."value") AS "maxBid",
 *     COUNT("bid"."walletAddress") AS "countBids",
 *     "auction"."winner" as "winner",
 *     MAX("bid"."timestamp") as "latestBidTime"
 * FROM 
 *     "bid"
 * LEFT JOIN "auction" on "bid"."auctionId" = "auction"."id" 
 * WHERE 
 *     "bid"."walletAddress" = :address!
 * GROUP BY 
 *     "bid"."auctionId", "auction"."winner"
 * ```
 */
export const getAddressBidsHistory = new PreparedQuery<IGetAddressBidsHistoryParams,IGetAddressBidsHistoryResult>(getAddressBidsHistoryIR);


/** 'GetLastAuctionUnindexedWalletsSocials' parameters type */
export interface IGetLastAuctionUnindexedWalletsSocialsParams {
  limit: number;
}

/** 'GetLastAuctionUnindexedWalletsSocials' return type */
export interface IGetLastAuctionUnindexedWalletsSocialsResult {
  walletAddress: string;
}

/** 'GetLastAuctionUnindexedWalletsSocials' query type */
export interface IGetLastAuctionUnindexedWalletsSocialsQuery {
  params: IGetLastAuctionUnindexedWalletsSocialsParams;
  result: IGetLastAuctionUnindexedWalletsSocialsResult;
}

const getLastAuctionUnindexedWalletsSocialsIR: any = {"usedParamSet":{"limit":true},"params":[{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":329,"b":335}]}],"statement":"SELECT DISTINCT \n    \"bid\".\"walletAddress\"\nFROM\n    \"bid\"\nLEFT JOIN\n    \"socials\" ON \"bid\".\"walletAddress\" = \"socials\".\"address\"\nWHERE\n    \"socials\".\"address\" IS NULL AND\n    \"bid\".\"auctionId\" IN (\n        SELECT \n            \"auctionId\"\n        FROM\n            \"bid\"\n        ORDER BY\n            \"auctionId\" DESC\n        LIMIT :limit!::INTEGER\n    )"};

/**
 * Query generated from SQL:
 * ```
 * SELECT DISTINCT 
 *     "bid"."walletAddress"
 * FROM
 *     "bid"
 * LEFT JOIN
 *     "socials" ON "bid"."walletAddress" = "socials"."address"
 * WHERE
 *     "socials"."address" IS NULL AND
 *     "bid"."auctionId" IN (
 *         SELECT 
 *             "auctionId"
 *         FROM
 *             "bid"
 *         ORDER BY
 *             "auctionId" DESC
 *         LIMIT :limit!::INTEGER
 *     )
 * ```
 */
export const getLastAuctionUnindexedWalletsSocials = new PreparedQuery<IGetLastAuctionUnindexedWalletsSocialsParams,IGetLastAuctionUnindexedWalletsSocialsResult>(getLastAuctionUnindexedWalletsSocialsIR);


/** 'SetAddressSocials' parameters type */
export interface ISetAddressSocialsParams {
  address: string;
  followers?: number | null | void;
  nickname?: string | null | void;
  type?: string | null | void;
}

/** 'SetAddressSocials' return type */
export type ISetAddressSocialsResult = void;

/** 'SetAddressSocials' query type */
export interface ISetAddressSocialsQuery {
  params: ISetAddressSocialsParams;
  result: ISetAddressSocialsResult;
}

const setAddressSocialsIR: any = {"usedParamSet":{"type":true,"nickname":true,"followers":true,"address":true},"params":[{"name":"type","required":false,"transform":{"type":"scalar"},"locs":[{"a":74,"b":78},{"a":164,"b":168}]},{"name":"nickname","required":false,"transform":{"type":"scalar"},"locs":[{"a":81,"b":89},{"a":186,"b":194}]},{"name":"followers","required":false,"transform":{"type":"scalar"},"locs":[{"a":92,"b":101},{"a":213,"b":222}]},{"name":"address","required":true,"transform":{"type":"scalar"},"locs":[{"a":104,"b":112}]}],"statement":"INSERT INTO socials (\"type\", \"nickname\", \"followers\", \"address\") \nVALUES (:type, :nickname, :followers, :address!)\nON CONFLICT (\"address\") DO UPDATE SET\n  \"type\" = :type,\n  \"nickname\" = :nickname,\n  \"followers\" = :followers"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO socials ("type", "nickname", "followers", "address") 
 * VALUES (:type, :nickname, :followers, :address!)
 * ON CONFLICT ("address") DO UPDATE SET
 *   "type" = :type,
 *   "nickname" = :nickname,
 *   "followers" = :followers
 * ```
 */
export const setAddressSocials = new PreparedQuery<ISetAddressSocialsParams,ISetAddressSocialsResult>(setAddressSocialsIR);


/** 'GetAddressDomains' parameters type */
export interface IGetAddressDomainsParams {
  address: string;
}

/** 'GetAddressDomains' return type */
export interface IGetAddressDomainsResult {
  followers: number | null;
  nickname: string | null;
  type: string | null;
}

/** 'GetAddressDomains' query type */
export interface IGetAddressDomainsQuery {
  params: IGetAddressDomainsParams;
  result: IGetAddressDomainsResult;
}

const getAddressDomainsIR: any = {"usedParamSet":{"address":true},"params":[{"name":"address","required":true,"transform":{"type":"scalar"},"locs":[{"a":62,"b":70}]}],"statement":"SELECT type, nickname, followers FROM socials WHERE address = :address! AND type = 'domain'"};

/**
 * Query generated from SQL:
 * ```
 * SELECT type, nickname, followers FROM socials WHERE address = :address! AND type = 'domain'
 * ```
 */
export const getAddressDomains = new PreparedQuery<IGetAddressDomainsParams,IGetAddressDomainsResult>(getAddressDomainsIR);


/** 'GetAddressDapps' parameters type */
export interface IGetAddressDappsParams {
  address: string;
}

/** 'GetAddressDapps' return type */
export interface IGetAddressDappsResult {
  followers: number | null;
  nickname: string | null;
  type: string | null;
}

/** 'GetAddressDapps' query type */
export interface IGetAddressDappsQuery {
  params: IGetAddressDappsParams;
  result: IGetAddressDappsResult;
}

const getAddressDappsIR: any = {"usedParamSet":{"address":true},"params":[{"name":"address","required":true,"transform":{"type":"scalar"},"locs":[{"a":62,"b":70}]}],"statement":"SELECT type, nickname, followers FROM socials WHERE address = :address! AND type = 'farcaster'"};

/**
 * Query generated from SQL:
 * ```
 * SELECT type, nickname, followers FROM socials WHERE address = :address! AND type = 'farcaster'
 * ```
 */
export const getAddressDapps = new PreparedQuery<IGetAddressDappsParams,IGetAddressDappsResult>(getAddressDappsIR);


/** 'GetWalletByAddress' parameters type */
export interface IGetWalletByAddressParams {
  address: string;
}

/** 'GetWalletByAddress' return type */
export interface IGetWalletByAddressResult {
  address: string;
  bio: string | null;
  ens: string | null;
}

/** 'GetWalletByAddress' query type */
export interface IGetWalletByAddressQuery {
  params: IGetWalletByAddressParams;
  result: IGetWalletByAddressResult;
}

const getWalletByAddressIR: any = {"usedParamSet":{"address":true},"params":[{"name":"address","required":true,"transform":{"type":"scalar"},"locs":[{"a":122,"b":130}]}],"statement":"SELECT wallet.address, wallet.ens, bio.\"bio\"\nFROM wallet \nLEFT JOIN bio on wallet.address = bio.\"bidder\" \nWHERE address = :address!\nORDER BY bio.\"timestamp\" DESC LIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT wallet.address, wallet.ens, bio."bio"
 * FROM wallet 
 * LEFT JOIN bio on wallet.address = bio."bidder" 
 * WHERE address = :address!
 * ORDER BY bio."timestamp" DESC LIMIT 1
 * ```
 */
export const getWalletByAddress = new PreparedQuery<IGetWalletByAddressParams,IGetWalletByAddressResult>(getWalletByAddressIR);


/** 'InsertWalletBio' parameters type */
export interface IInsertWalletBioParams {
  author?: string | null | void;
  bidder?: string | null | void;
  bio?: string | null | void;
}

/** 'InsertWalletBio' return type */
export type IInsertWalletBioResult = void;

/** 'InsertWalletBio' query type */
export interface IInsertWalletBioQuery {
  params: IInsertWalletBioParams;
  result: IInsertWalletBioResult;
}

const insertWalletBioIR: any = {"usedParamSet":{"bidder":true,"bio":true,"author":true},"params":[{"name":"bidder","required":false,"transform":{"type":"scalar"},"locs":[{"a":53,"b":59}]},{"name":"bio","required":false,"transform":{"type":"scalar"},"locs":[{"a":62,"b":65}]},{"name":"author","required":false,"transform":{"type":"scalar"},"locs":[{"a":68,"b":74}]}],"statement":"INSERT INTO bio (\"bidder\", \"bio\", \"author\") \nVALUES (:bidder, :bio, :author)\nON CONFLICT (\"bio\") DO NOTHING"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO bio ("bidder", "bio", "author") 
 * VALUES (:bidder, :bio, :author)
 * ON CONFLICT ("bio") DO NOTHING
 * ```
 */
export const insertWalletBio = new PreparedQuery<IInsertWalletBioParams,IInsertWalletBioResult>(insertWalletBioIR);


/** 'GetPriceStats' parameters type */
export interface IGetPriceStatsParams {
  days: NumberOrString;
}

/** 'GetPriceStats' return type */
export interface IGetPriceStatsResult {
  id: number;
  price: string | null;
  startTime: number;
}

/** 'GetPriceStats' query type */
export interface IGetPriceStatsQuery {
  params: IGetPriceStatsParams;
  result: IGetPriceStatsResult;
}

const getPriceStatsIR: any = {"usedParamSet":{"days":true},"params":[{"name":"days","required":true,"transform":{"type":"scalar"},"locs":[{"a":90,"b":95}]}],"statement":"SELECT id, price, \"startTime\" FROM auction WHERE price IS NOT NULL ORDER BY id DESC LIMIT :days!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT id, price, "startTime" FROM auction WHERE price IS NOT NULL ORDER BY id DESC LIMIT :days!
 * ```
 */
export const getPriceStats = new PreparedQuery<IGetPriceStatsParams,IGetPriceStatsResult>(getPriceStatsIR);


/** 'GetBidsStats' parameters type */
export interface IGetBidsStatsParams {
  days: NumberOrString;
}

/** 'GetBidsStats' return type */
export interface IGetBidsStatsResult {
  timestamp: number | null;
}

/** 'GetBidsStats' query type */
export interface IGetBidsStatsQuery {
  params: IGetBidsStatsParams;
  result: IGetBidsStatsResult;
}

const getBidsStatsIR: any = {"usedParamSet":{"days":true},"params":[{"name":"days","required":true,"transform":{"type":"scalar"},"locs":[{"a":205,"b":210}]}],"statement":"SELECT bid.\"timestamp\"\nFROM bid\nWHERE bid.\"timestamp\" IS NOT NULL AND bid.\"auctionId\" IN (\n    SELECT bid.\"auctionId\"\n    FROM bid\n    GROUP BY bid.\"auctionId\" \n    ORDER BY bid.\"auctionId\" DESC\n    LIMIT :days!\n)"};

/**
 * Query generated from SQL:
 * ```
 * SELECT bid."timestamp"
 * FROM bid
 * WHERE bid."timestamp" IS NOT NULL AND bid."auctionId" IN (
 *     SELECT bid."auctionId"
 *     FROM bid
 *     GROUP BY bid."auctionId" 
 *     ORDER BY bid."auctionId" DESC
 *     LIMIT :days!
 * )
 * ```
 */
export const getBidsStats = new PreparedQuery<IGetBidsStatsParams,IGetBidsStatsResult>(getBidsStatsIR);


