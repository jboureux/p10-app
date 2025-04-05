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

FROM node:23-alpine AS production

WORKDIR /app

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/package.json .
COPY --from=builder /build/pnpm-lock.yaml .
COPY --from=builder /build/prisma ./prisma
COPY --from=builder /build/.env.prod .env
COPY --from=builder /build/prod-entrypoint.sh .
RUN chmod +x prod-entrypoint.sh

COPY --from=builder /build/node_modules ./node_modules

RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN pnpm install --frozen-lockfile --prod

EXPOSE 4000

ENTRYPOINT ["sh", "prod-entrypoint.sh"]