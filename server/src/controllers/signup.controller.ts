import { RouteHandler } from "fastify";

interface PostSignUpVerificationMailBody {
  email: string;
}

export const postSignUpVerificationMail: RouteHandler<{
  Body: PostSignUpVerificationMailBody;
}> = async (request, reply) => {
  try {
    return reply.status(200).send({
      success: true,
      message: "인증 메일이 발송되었습니다.",
    });
  } catch (error) {
    return reply.status(500).send({
      success: false,
      message: "오류가 발생했습니다.",
    });
  }
};
