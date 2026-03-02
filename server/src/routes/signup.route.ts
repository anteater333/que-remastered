import { FastifyPluginAsync } from "fastify";
import {
  postSignUp,
  postSignUpVerificationCheck,
  postSignUpVerificationMail,
} from "../controllers";
import {
  postSignUpSchema,
  postSignUpVerificationCheckSchema,
  postSignUpVerificationMailSchema,
} from "../schemes/signup.schema";

const signUpRoutes: FastifyPluginAsync = async (server, options) => {
  server.post(
    "/",
    {
      schema: {
        body: postSignUpSchema,
      },
    },
    postSignUp,
  );
  server.post(
    "/verification",
    {
      schema: {
        body: postSignUpVerificationMailSchema,
      },
    },
    postSignUpVerificationMail,
  );
  server.post(
    "/verification/check",
    {
      schema: {
        body: postSignUpVerificationCheckSchema,
      },
    },
    postSignUpVerificationCheck,
  );
};

export default signUpRoutes;
