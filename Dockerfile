FROM node:20

ARG AIRSTACK_API_KEY
ARG APP_URL

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

# Some parts of the build process depend on these environment variables,
# we need to refactor the code to get rid of this dependency
ENV DATABASE_URL="postgresql://"
ENV PROVIDER_URL="https://"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV AIRSTACK_API_KEY=$AIRSTACK_API_KEY
ENV APP_URL=$APP_URL

RUN yarn build

ENV DATABASE_URL=
ENV PROVIDER_URL=

CMD [ "yarn", "migrate-and-start" ]
