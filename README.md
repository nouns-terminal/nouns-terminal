## Getting Started

Clone the repo:

```bash
$ git clone git@github.com:w1nt3r-eth/nouns.sh.git
$ cd nouns.sh
```

Install dependencies:

```bash
$ yarn
```

Generate TypeScript typings for Ethereum smart contracts:

```bash
$ yarn typechain
```

Create .env as an example you can use .env.example.

Generate TypeScript typings for database queries

```bash
$ export DATABASE_URL="postgresql://..."
$ yarn pgtyped
```

Run sever:

```bash
$ yarn dev
# or
$ yarn start
```

Open [http://localhost:3003](http://localhost:3003) with your browser to see the result.
