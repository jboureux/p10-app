#!/bin/sh

echo "✅ Configuring pnpm..."
pnpm config set allow-scripts true

echo "📦 Installing dependencies..."
pnpm install --yes

echo "🔁 Running Prisma generate..."
pnpm exec prisma generate --env-file=.env.dev

echo "🚀 Waiting for PostgreSQL to be ready..."
until nc -z db 5432; do
  echo "⏳ Waiting for PostgreSQL on db:5432..."
  sleep 1
done

echo "📂 Running Prisma migrate dev..."
pnpm exec prisma migrate dev --name auto-init --create-only --env-file=.env.dev || true
pnpm exec prisma migrate deploy --env-file=.env.dev || true

echo "🏁 Starting dev servera..."
pnpm dev
