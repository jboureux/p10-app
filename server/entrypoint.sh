#!/bin/sh

echo "📦 Installing dependencies..."
pnpm install

echo "🔁 Running Prisma generate..."
pnpm exec prisma generate

echo "🚀 Waiting for PostgreSQL to be ready..."
until nc -z db 5432; do
  echo "⏳ Waiting for PostgreSQL on db:5432..."
  sleep 1
done

echo "📂 Running Prisma migrate dev..."
pnpm exec prisma migrate dev --name auto-init --create-only || true
pnpm exec prisma migrate deploy || true

echo "🏁 Starting dev server..."
pnpm dev
