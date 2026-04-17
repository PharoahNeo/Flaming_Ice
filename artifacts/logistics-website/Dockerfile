FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /workspace

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json tsconfig.json ./
COPY artifacts/logistics-website/package.json ./artifacts/logistics-website/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-zod/package.json ./lib/api-zod/
RUN pnpm install --frozen-lockfile

FROM deps AS builder
COPY artifacts/logistics-website ./artifacts/logistics-website
COPY lib ./lib
ARG BASE_PATH=/
ENV BASE_PATH=${BASE_PATH}
RUN pnpm --filter @workspace/logistics-website run build

FROM nginx:alpine AS runner
COPY --from=builder /workspace/artifacts/logistics-website/dist/public /usr/share/nginx/html
COPY artifacts/logistics-website/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
