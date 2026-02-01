import { FastifyPluginAsync } from "fastify";
import {
  postSignUpVerificationCheck,
  postSignUpVerificationMail,
} from "../controllers";

const signUpRoutes: FastifyPluginAsync = async (server, options) => {
  server.post("/verification", postSignUpVerificationMail);
  server.post("/verification/check", postSignUpVerificationCheck);
};

export default signUpRoutes;
