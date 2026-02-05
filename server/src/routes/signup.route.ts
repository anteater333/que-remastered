import { FastifyPluginAsync } from "fastify";
import {
  postSignUp,
  postSignUpVerificationCheck,
  postSignUpVerificationMail,
} from "../controllers";

const signUpRoutes: FastifyPluginAsync = async (server, options) => {
  server.post("/", postSignUp);
  server.post("/verification", postSignUpVerificationMail);
  server.post("/verification/check", postSignUpVerificationCheck);
};

export default signUpRoutes;
