import { FastifyPluginAsync } from "fastify";
import { postSignIn, postSignOut } from "../controllers";

const signInRoutes: FastifyPluginAsync = async (server, options) => {
  server.post("/", postSignIn);
  server.post("/signout", postSignOut);
};

export default signInRoutes;
