import { FastifyPluginAsync } from "fastify";
import { getMe } from "../controllers";

const userRoutes: FastifyPluginAsync = async (server, options) => {
  server.get("/me", { onRequest: [server.authenticate] }, getMe);
};

export default userRoutes;
