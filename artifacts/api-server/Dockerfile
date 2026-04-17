FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /workspace

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json tsconfig.json ./
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY lib/db/package.json ./lib/db/
COPY lib/api-zod/package.json ./lib/api-zod/
RUN pnpm install --frozen-lockfile

FROM deps AS builder
COPY artifacts/api-server ./artifacts/api-server
COPY lib ./lib
RUN pnpm --filter @workspace/api-server run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /workspace/artifacts/api-server/dist ./dist
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
