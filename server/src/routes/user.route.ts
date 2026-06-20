import { FastifyPluginAsync } from "fastify";
import { getMe, postOnBoardingProfile } from "../controllers";
import {
  PostOnBoardingProfileBody,
  postOnBoardingProfileScheme,
} from "../schemes/user.schema";

const userRoutes: FastifyPluginAsync = async (server, options) => {
  server.get("/me", { onRequest: [server.authenticate] }, getMe);
  server.post<{ Body: PostOnBoardingProfileBody }>(
    "/onboarding/profile",
    {
      schema: { body: postOnBoardingProfileScheme },
      onRequest: [server.authenticate],
    },
    postOnBoardingProfile,
  );
};

export default userRoutes;
