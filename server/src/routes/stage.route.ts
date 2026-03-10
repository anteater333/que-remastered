import { FastifyPluginAsync } from "fastify";
import { postStage } from "../controllers";

const stageRoutes: FastifyPluginAsync = async (server, options) => {
  server.post(
    "/",
    {
      preHandler: [server.authenticate, server.authorizeOwner],
    },
    postStage,
  );
};

export default stageRoutes;
