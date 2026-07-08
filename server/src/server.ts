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
    transport: isProduction
      ? undefined
      : {
          target: "pino-pretty",
          level: "info",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          },
        },
  },
}).withTypeProvider<ZodTypeProvider>();

// Zod 검증기 등록
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Zod 에러 핸들러
server.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    const errors = error.validation.map((issue) => ({
      field:
        issue.instancePath.replace(/^\//, "").replace(/\//g, ".") ||
        issue.params?.missingProperty,
      message: issue.message,
      code: issue.keyword,
    }));

    return reply.status(400).send({
      error: "VALIDATION_ERROR",
      errors,
    });
  }
  reply.send(error);
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

/** Fastify Logger for global context */
export const globalLogger = server.log;
