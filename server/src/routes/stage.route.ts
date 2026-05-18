import { FastifyPluginAsync } from "fastify";
import {
  getStage,
  getStageVideoStatus,
  patchStage,
  postStage,
  postStageVideo,
} from "../controllers";
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
  server.get<{ Params: StageIdParams }>(
    "/:stageId",
    {
      schema: {
        params: stageIdParamSchema,
      },
    },
    getStage,
  );
  server.get<{ Params: StageIdParams }>(
    "/:stageId/video/status",
    {
      schema: {
        params: stageIdParamSchema,
      },
      sse: true,
    },
    getStageVideoStatus,
  );
};

export default stageRoutes;
