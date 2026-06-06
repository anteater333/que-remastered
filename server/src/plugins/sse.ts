import fastifySSE from "@fastify/sse";
import fp from "fastify-plugin";

/** Server Side Event 기능을 위한 미들웨어 설정 */
const ssePlugin = fp(async (fastify) => {
  fastify.register(fastifySSE);
});

export default ssePlugin;
