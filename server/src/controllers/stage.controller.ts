import { RouteHandler } from "fastify";
import { PostStageBody } from "../schemes/stage.schema";

export const postStage: RouteHandler<{
  Body: PostStageBody;
}> = async (request, reply) => {
  return reply.status(501).send();
};
