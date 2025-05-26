#!/bin/sh

pnpm dlx prisma migrate deploy

node dist/src/main.js