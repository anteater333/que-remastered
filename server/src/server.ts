import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors, FastifyCorsOptions } from "@fastify/cors";
import Fastify, { FastifyInstance } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

const isProduction = process.env.NODE_ENV === "production";

console.log("🎙️ Setting QUE API server instance...");
console.log("🎙️ isProduction:", isProduction, process.env.NODE_ENV);

const server: FastifyInstance = Fastify({
  logger: {
    transport: {
      targets: isProduction
        ? []
        : [
            {
              target: "pino-pretty",
              level: "info",
              options: {
                colorize: true,
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            },
          ],
    },
  },
}).withTypeProvider<ZodTypeProvider>();

// Zod 검증기 등록
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// 서버 설정
server.register(fastifyCors, {
  origin: [process.env.WWW_HOST],
  credentials: true,
} as FastifyCorsOptions);

server.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET_KEY,
});

export default server;

/** Fastify Logger for global context */
export const globalLogger = server.log;
