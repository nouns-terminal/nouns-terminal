CREATE TABLE "public"."auction" (
    "id" int4 NOT NULL,
    "startTime" int4 NOT NULL,
    "endTime" int4 NOT NULL,
    "winner" text,
    "price" numeric(78,0),
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."bid" (
    "tx" text NOT NULL,
    "index" int4 NOT NULL,
    "auctionId" int4 NOT NULL,
    "walletAddress" text NOT NULL,
    "value" numeric(78,0) NOT NULL,
    "maxFeePerGas" numeric(78,0) NOT NULL,
    "block" int4 NOT NULL,
    "walletBalance" numeric(78,0) DEFAULT NULL,
    "extended" bool NOT NULL,
    "timestamp" int4,
    PRIMARY KEY ("tx", "index")
);

CREATE TABLE "public"."noun" (
    "id" int4 NOT NULL,
    "background" int4 NOT NULL,
    "body" int4 NOT NULL,
    "accessory" int4 NOT NULL,
    "head" int4 NOT NULL,
    "glasses" int4 NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."state" (
    "key" text NOT NULL,
    "value" int4,
    PRIMARY KEY ("key")
);

CREATE TABLE "public"."wallet" (
    "address" text NOT NULL,
    "ens" text,
    "nouns" int4,
    PRIMARY KEY ("address")
);

CREATE INDEX idx_bid_tx ON public.bid("tx");
CREATE INDEX idx_bid_auctionId_value ON public.bid("auctionId", value DESC);
CREATE INDEX idx_bid_walletAddress_auctionId ON public.bid("walletAddress", "auctionId" DESC);
CREATE INDEX idx_auction_id_desc ON public.auction("id" DESC);
CREATE INDEX idx_noun_id ON public.noun("id");