import { FastifyPluginAsync } from "fastify";
import { postSignUpVerificationMail } from "../controllers";

const signUpRoutes: FastifyPluginAsync = async (server, options) => {
  server.post("/verification", postSignUpVerificationMail);
};

export default signUpRoutes;
