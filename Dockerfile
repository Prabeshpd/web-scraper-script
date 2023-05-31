FROM node:16.17-bullseye-slim AS base

FROM base AS builder
WORKDIR /web-scraper-script
COPY ["package.json", "yarn.lock",  "tsconfig.json", "./"]
RUN  yarn
COPY ["src", "./src"]
RUN yarn build

FROM builder AS dependencies
WORKDIR /web-scraper-script
COPY ["package.json", "yarn.lock",  "./"]
RUN yarn --prod


FROM base AS main
WORKDIR /web-scraper-script
COPY --from=builder /web-scraper-script/dist /web-scraper-script/dist
COPY --from=builder ["web-scraper-script/package.json", "web-scraper-script/yarn.lock", "web-scraper-script/"]
COPY --from=dependencies /web-scraper-script/node_modules /web-scraper-script/node_modules
ENTRYPOINT [ "node", "dist/server.js" ]
