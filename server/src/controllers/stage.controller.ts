import { RouteHandler } from "fastify";

export const postStage: RouteHandler = async (request, reply) => {
  return reply.code(501).send({ message: "개발중입니다." });
};
