import { FastifyPluginAsync } from "fastify";
import { postStage } from "../controllers";
import { PostStageBody, postStageSchema } from "../schemes/stage.schema";

const stageRoutes: FastifyPluginAsync = async (server, options) => {
  server.post<{ Body: PostStageBody }>(
    "/",
    {
      schema: {
        body: postStageSchema,
      },
      preHandler: [server.authenticate, server.authorizeOwner],
    },
    postStage,
  );
};

export default stageRoutes;
