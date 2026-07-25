import { FastifyPluginAsync } from "fastify";
import {
  getMe,
  getUserCount,
  postOnBoardingProfile,
  postOnBoardingProfileImage,
} from "../controllers";
import {
  PostOnBoardingProfileBody,
  postOnBoardingProfileScheme,
} from "../schemes/user.schema";

const userRoutes: FastifyPluginAsync = async (server, options) => {
  server.get("/count", getUserCount);
  server.get("/me", { onRequest: [server.authenticate] }, getMe);
  server.post<{ Body: PostOnBoardingProfileBody }>(
    "/onboarding/profile",
    {
      schema: { body: postOnBoardingProfileScheme },
      onRequest: [server.authenticate],
    },
    postOnBoardingProfile,
  );
  server.post(
    "/onboarding/profile/image",
    {
      onRequest: [server.authenticate],
    },
    postOnBoardingProfileImage,
  );
};

export default userRoutes;
