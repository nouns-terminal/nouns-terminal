# Nouns Terminal

[Nouns Terminal](https://nouns.sh) is Nouns acuction client focused on high information density.

## Self hosting with Docker

The easiest way to run Nouns Terminal locally is to use Docker Compose.

1. Copy [`docker-compose.yaml`](https://github.com/nouns-terminal/nouns-terminal/blob/main/docker-compose.yml) into your local folder
2. Copy [`.env.example`](https://github.com/nouns-terminal/nouns-terminal/blob/main/.env.example) into `.env`
3. Follow the instructions in `.env` for usage with Docker Compose
4. Run `docker compose up -d`
5. Visit `http://localhost:3003/`

## Development

Clone the repo:

```bash
$ git clone https://github.com/nouns-terminal/nouns-terminal.git
$ cd nouns-terminal
```

Install dependencies:

```bash
$ yarn
```

Generate TypeScript typings for Ethereum smart contracts:

```bash
$ yarn typechain
```

Set up your environment variables:

```bash
$ cp .env.example .env
```

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

Open [http://localhost:3003](http://localhost:3003) with your browser.
