FROM node:23-alpine

WORKDIR /app

COPY . .

RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

COPY dev-entrypoint.sh /dev-entrypoint.sh
RUN chmod +x /dev-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/dev-entrypoint.sh"]