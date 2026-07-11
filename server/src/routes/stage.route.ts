import { FastifyPluginAsync } from "fastify";
import {
  getStage,
  getStageList,
  getStageVideoStatus,
  patchStage,
  postStage,
  postStageVideo,
} from "../controllers";
import {
  getStageListQuerySchema,
  PatchStageBody,
  patchStageSchema,
  StageIdParams,
  stageIdParamSchema,
} from "../schemes/stage.schema";

const stageRoutes: FastifyPluginAsync = async (server, options) => {
  server.get(
    "/",
    { schema: { querystring: getStageListQuerySchema } },
    getStageList,
  );
  server.post(
    "/",
    {
      onRequest: [server.authenticate],
      preHandler: [server.authorizeOwner],
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
      onRequest: [server.authenticate],
      preHandler: [server.authorizeOwner],
    },
    patchStage,
  );
  server.post<{ Params: StageIdParams }>(
    "/:stageId/video",
    {
      schema: {
        params: stageIdParamSchema,
      },
      onRequest: [server.authenticate],
      preHandler: [server.authorizeOwner],
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
