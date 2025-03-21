FROM node:23-alpine AS builder

WORKDIR /build

COPY . .

RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM node:23-alpine as production

WORKDIR /app

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package.json .
COPY --from=builder /build/pnpm-lock.yaml .

RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm install --frozen-lockfile --prod

EXPOSE 4000

CMD ["node", "dist/index.js"]