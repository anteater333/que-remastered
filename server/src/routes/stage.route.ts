import { FastifyPluginAsync } from "fastify";
import { patchStage, postStage, postStageVideo } from "../controllers";
import {
  PatchStageBody,
  patchStageSchema,
  StageIdParams,
  stageIdParamSchema,
} from "../schemes/stage.schema";

const stageRoutes: FastifyPluginAsync = async (server, options) => {
  server.post(
    "/",
    {
      preHandler: [server.authenticate, server.authorizeOwner],
    },
    postStage,
  );
  server.patch<{ Body: PatchStageBody; Params: StageIdParams }>(
    "/:stageId",
    {
      schema: {
        params: stageIdParamSchema,
        body: patchStageSchema,
      },
      preHandler: [server.authenticate, server.authorizeOwner],
    },
    patchStage,
  );
  server.post<{ Params: StageIdParams }>(
    "/:stageId/video",
    {
      schema: {
        params: stageIdParamSchema,
      },
      preHandler: [server.authenticate, server.authorizeOwner],
    },
    postStageVideo,
  );
};

export default stageRoutes;
