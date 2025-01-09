FROM node:20.17-alpine as base
ENV NPM_CONFIG_USERCONFIG=/kaniko/secret/npmrc
WORKDIR /app

COPY yarn.lock package.json /app/
RUN yarn install --frozen-lockfile --production

# ENV NODE_ENV=production

FROM base as builder

RUN yarn install --frozen-lockfile --production=false

COPY . .

RUN yarn build:all

FROM base

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY migrations ./migrations
COPY ormconfig.ts yarn.lock package.json tsconfig.json datasource.ts config.d.ts ./
COPY config ./config

