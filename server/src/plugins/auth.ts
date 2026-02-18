import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import "@fastify/cookie";

/** JWT 인증 관련 플러그인 설정 */
const authPlugin = fp(async (fastify) => {
  fastify.register(jwt, {
    secret: process.env.JWT_SECRET_KEY || "",
  });

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const rawCookie = request.cookies["accessToken"];
        if (!rawCookie) {
          throw new Error("No cookie found");
        }

        const unsigned = request.unsignCookie(rawCookie);
        if (!unsigned.valid || !unsigned.value) {
          throw new Error("Invalid cookie signature");
        }

        const decoded = fastify.jwt.verify(unsigned.value);

        request.user = decoded;
      } catch (err) {
        reply.code(401).send({
          message: "인증 실패",
          error: err,
        });
      }
    },
  );
});

export default authPlugin;
