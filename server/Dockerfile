# 1. 빌드
FROM node:22-alpine AS builder
WORKDIR /app

## docker-compose는 프로젝트 루트에서 실행되므로
## 루트 기준으로 가져옴
COPY shared ./shared
COPY server ./server

WORKDIR /app/server
RUN yarn install
RUN yarn build

# 2. 실행
FROM node:22-alpine
WORKDIR /app/server

COPY --from=builder /app/server/package.json ./
COPY --from=builder /app/server/node_modules ./node_modules
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/prisma ./prisma

# 실행에 필요한 스크립트 복사 및 권한 부여
COPY server/start.sh ./
RUN chmod +x start.sh

EXPOSE 3000

CMD ["./start.sh"]