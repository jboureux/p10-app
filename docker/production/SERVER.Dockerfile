FROM node:23-alpine AS builder

WORKDIR /build

COPY . .

RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm install --frozen-lockfile

COPY .env.prod .env

RUN pnpm exec prisma generate

RUN pnpm build

FROM node:23-alpine as production

WORKDIR /app

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package.json .
COPY --from=builder /build/pnpm-lock.yaml .
COPY --from=builder /build/prisma ./prisma
COPY --from=builder /build/.env.prod .env

COPY --from=builder /build/node_modules ./node_modules

RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm exec prisma migrate deploy --schema=./prisma/schema.prisma || true

EXPOSE 4000

CMD ["node", "dist/index.js"]