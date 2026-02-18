import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors, FastifyCorsOptions } from "@fastify/cors";
import Fastify, { FastifyInstance } from "fastify";

const server: FastifyInstance = Fastify({
  logger: true,
});

// 서버 설정
server.register(fastifyCors, {
  origin: [process.env.WWW_HOST],
  credentials: true,
} as FastifyCorsOptions);

server.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET_KEY,
});

export default server;
