FROM node:22

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# Some parts of the build process depend on these environment variables,
# we need to refactor the code to get rid of this dependency
ENV DATABASE_URL="postgresql://"
ENV PROVIDER_URL="https://"
ENV NODE_ENV=production

RUN yarn build

ENV DATABASE_URL=
ENV PROVIDER_URL=

EXPOSE 3003


CMD [ "yarn", "migrate-and-start" ]
