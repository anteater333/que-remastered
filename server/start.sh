#!/bin/sh

# 1. DB 마이그레이션 실행
echo "Running database migrations..."
npx prisma migrate deploy

# 2. 메인 서버 실행
echo "Starting the server..."
node dist/server/src/index.js