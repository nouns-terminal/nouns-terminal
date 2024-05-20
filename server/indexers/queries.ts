/** Types generated for queries found in "server/indexers/queries.sql" */
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
  address: string;
  auctionId: number;
}

/** 'FindUnindexedWallets' query type */
export interface IFindUnindexedWalletsQuery {
  params: IFindUnindexedWalletsParams;
  result: IFindUnindexedWalletsResult;
}

const findUnindexedWalletsIR: any = {"usedParamSet":{"limit":true},"params":[{"name":"limit","required":true,"transform":{"type":"scalar"},"locs":[{"a":195,"b":201}]}],"statement":"SELECT \"bid\".\"auctionId\", \"bid\".\"walletAddress\" as \"address\"\nFROM \"bid\"\nLEFT JOIN \"wallet\" ON \"bid\".\"walletAddress\" = \"wallet\".\"address\"\nWHERE \"ens\" IS NULL ORDER BY \"bid\".\"auctionId\" DESC LIMIT :limit!::INTEGER"};

/**
 * Query generated from SQL:
 * ```
 * SELECT "bid"."auctionId", "bid"."walletAddress" as "address"
 * FROM "bid"
 * LEFT JOIN "wallet" ON "bid"."walletAddress" = "wallet"."address"
 * WHERE "ens" IS NULL ORDER BY "bid"."auctionId" DESC LIMIT :limit!::INTEGER
 * ```
 */
export const findUnindexedWallets = new PreparedQuery<IFindUnindexedWalletsParams,IFindUnindexedWalletsResult>(findUnindexedWalletsIR);


/** 'UpdateWalletData' parameters type */
export interface IUpdateWalletDataParams {
  address: string;
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

const updateWalletDataIR: any = {"usedParamSet":{"address":true,"ens":true,"nouns":true},"params":[{"name":"address","required":true,"transform":{"type":"scalar"},"locs":[{"a":57,"b":65}]},{"name":"ens","required":true,"transform":{"type":"scalar"},"locs":[{"a":68,"b":72},{"a":132,"b":135}]},{"name":"nouns","required":true,"transform":{"type":"scalar"},"locs":[{"a":75,"b":81},{"a":150,"b":155}]}],"statement":"INSERT INTO \"wallet\" (\"address\", \"ens\", \"nouns\")\nVALUES (:address!, :ens!, :nouns!)\nON CONFLICT (\"address\") DO UPDATE SET\n  \"ens\" = :ens,\n  \"nouns\" = :nouns"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO "wallet" ("address", "ens", "nouns")
 * VALUES (:address!, :ens!, :nouns!)
 * ON CONFLICT ("address") DO UPDATE SET
 *   "ens" = :ens,
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
  accessory: number;
  background: number;
  body: number;
  glasses: number;
  head: number;
  id: number;
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

const getBidsByAuctionIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":195,"b":198}]}],"statement":"SELECT\n  bid.\"tx\", \n  bid.\"walletAddress\", \n  bid.\"value\"::TEXT,\n  bid.\"walletBalance\"::TEXT,\n  bid.\"extended\",\n  bid.\"timestamp\",\n  bid.\"maxFeePerGas\"::TEXT\nFROM\n  bid\nWHERE\n  bid.\"auctionId\" = :id!::INTEGER\nORDER BY\n  bid.value DESC"};

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
  bids: string | null;
  ens: string | null;
  nouns: number | null;
  wins: string | null;
}

/** 'GetWalletsByAuctionId' query type */
export interface IGetWalletsByAuctionIdQuery {
  params: IGetWalletsByAuctionIdParams;
  result: IGetWalletsByAuctionIdResult;
}

const getWalletsByAuctionIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":519,"b":522}]}],"statement":"WITH wins_count AS (\n    SELECT winner, COUNT(*) AS count \n    FROM auction \n    GROUP BY winner\n),\nbid_counts AS (\n    SELECT \"walletAddress\", COUNT(*) AS count\n    FROM bid\n    GROUP BY \"walletAddress\"\n)\nSELECT\n  b.\"walletAddress\" AS \"address\",\n  w.ens,\n  bc.count AS \"bids\", \n  w.\"nouns\", \n  wc.count AS \"wins\"\nFROM\n  bid b\nJOIN\n  wallet w ON b.\"walletAddress\" = w.address\nLEFT JOIN\n  wins_count wc ON wc.winner = b.\"walletAddress\"\nLEFT JOIN\n  bid_counts bc ON bc.\"walletAddress\" = w.address\nWHERE\n  b.\"auctionId\" = :id!::INTEGER"};

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
 * )
 * SELECT
 *   b."walletAddress" AS "address",
 *   w.ens,
 *   bc.count AS "bids", 
 *   w."nouns", 
 *   wc.count AS "wins"
 * FROM
 *   bid b
 * JOIN
 *   wallet w ON b."walletAddress" = w.address
 * LEFT JOIN
 *   wins_count wc ON wc.winner = b."walletAddress"
 * LEFT JOIN
 *   bid_counts bc ON bc."walletAddress" = w.address
 * WHERE
 *   b."auctionId" = :id!::INTEGER
 * ```
 */
export const getWalletsByAuctionId = new PreparedQuery<IGetWalletsByAuctionIdParams,IGetWalletsByAuctionIdResult>(getWalletsByAuctionIdIR);


