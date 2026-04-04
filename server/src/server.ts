import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors, FastifyCorsOptions } from "@fastify/cors";
import Fastify, { FastifyInstance } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";
const logPath = process.env.LOG_PATH ?? __dirname;

console.log("🎙️ Setting QUE API server instance...");
console.log("🎙️ isProduction:", isProduction, process.env.NODE_ENV);
console.log("🎙️ logPath", logPath);

const server: FastifyInstance = Fastify({
  logger: {
    transport: {
      targets: isProduction
        ? [
            {
              target: "pino-roll",
              level: "info",
              options: {
                file: path.join(logPath, "app"),
                frequency: "daily",
                dateFormat: "yyyyMMdd",
                extension: ".log",
                mkdir: true,
                limit: {
                  count: 30,
                },
              },
            },
            {
              // 에러 로그 별도 저장
              target: "pino-roll",
              level: "error",
              options: {
                file: path.join(logPath, "error"),
                frequency: "daily",
                dateFormat: "yyyyMMdd",
                extension: ".log",
                mkdir: true,
              },
            },
          ]
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
