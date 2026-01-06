import { RouteHandler } from "fastify";
import prisma from "../services/connectors/prisma.service";

interface PostSignUpVerificationMailBody {
  email: string;
}

export const postSignUpVerificationMail: RouteHandler<{
  Body: PostSignUpVerificationMailBody;
}> = async (request, reply) => {
  try {
    const email = request.body.email;

    if (!email) {
      return reply.status(400).send({ message: "이메일을 입력해주세요." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    // 이미 사용 중인 이메일 있음
    if (existingUser) {
      return reply.status(409).send({ message: "이미 가입된 이메일입니다." });
    }

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
