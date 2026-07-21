import { FastifyPluginAsync } from "fastify";
import { getStudio } from "../controllers";
import {
  StudioHandleParams,
  studioHandleParamSchema,
} from "../schemes/studio.schema";

const studioRoutes: FastifyPluginAsync = async (server, options) => {
  server.get<{ Params: StudioHandleParams }>(
    "/:handle",
    {
      schema: {
        params: studioHandleParamSchema,
      },
    },
    getStudio,
  );
};

export default studioRoutes;
