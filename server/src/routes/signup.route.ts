import { FastifyPluginAsync } from "fastify";

const signUpRoutes: FastifyPluginAsync = async (server, options) => {
  server.post("/varification", async (request, reply) => {
    return {};
  });
};

export default signUpRoutes;
