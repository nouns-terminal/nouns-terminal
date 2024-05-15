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
    "auctionId" int4 NOT NULL,
    "walletAddress" text NOT NULL,
    "value" numeric(78,0) NOT NULL,
    "maxFeePerGas" numeric(78,0) NOT NULL,
    "block" int4 NOT NULL,
    "extended" bool NOT NULL,
    "timestamp" int4,
    PRIMARY KEY ("tx")
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
    "balanceEth" numeric(78,0),
    "balanceWeth" numeric(78,0),
    "nouns" int4,
    PRIMARY KEY ("address")
);
