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

## Software License

Nouns Terminal
Copyright (C) 2024 yukigesho.eth & w1nt3r.eth

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

## Font License

This project is using the fantastic [Proto Mono](https://supply.family/shop/proto-mono/) font face. You'll need a license from them if you'd like to publish a copy of Nouns Terminal on your own website. See [EULA](https://supply.family/end-user-license-agreement-webfont/).
