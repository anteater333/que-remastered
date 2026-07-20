import { FastifyPluginAsync } from "fastify";
import { getStudio } from "../controllers";
import { StudioIdParams, studioIdParamSchema } from "../schemes/studio.schema";

const studioRoutes: FastifyPluginAsync = async (server, options) => {
  server.get<{ Params: StudioIdParams }>(
    "/:studioId",
    {
      schema: {
        params: studioIdParamSchema,
      },
    },
    getStudio,
  );
};

export default studioRoutes;
