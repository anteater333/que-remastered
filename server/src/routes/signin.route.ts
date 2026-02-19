import { FastifyPluginAsync } from "fastify";
import { postSignIn } from "../controllers/signin.controller";

const signInRoutes: FastifyPluginAsync = async (server, options) => {
  server.post("/", postSignIn);
  // server.post("/logout", postSignOut);
};

export default signInRoutes;
