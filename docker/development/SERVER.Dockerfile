FROM node:23-alpine

WORKDIR /app

COPY . .

RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

EXPOSE 4000

CMD pnpm install && pnpm dev

