import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

/** JWT 인증 관련 플러그인 설정 */
const authPlugin = fp(async (fastify) => {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET_KEY || "",
  });

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    },
  );
});

export default authPlugin;
