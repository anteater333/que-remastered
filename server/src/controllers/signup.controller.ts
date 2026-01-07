import { RouteHandler } from "fastify";
import prisma from "../services/connectors/prisma.service";
import { generateRandomCode } from "../utils/generator";
import redisService from "../services/connectors/redis.service";
import mailService from "../services/mail.service";

interface PostSignUpVerificationMailBody {
  email: string;
}

const REDIS_AUTH_EMAIL_KEY_PREFIX = "que-authEmail-";

export const postSignUpVerificationMail: RouteHandler<{
  Body: PostSignUpVerificationMailBody;
}> = async (request, reply) => {
  const email = request.body.email;

  if (!email) {
    return reply.status(400).send({ message: "이메일을 입력해주세요." });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  // 이미 사용 중인 이메일 있음
  if (existingUser) {
    return reply.status(409).send({ message: "이미 가입된 이메일입니다." });
  }

  // 인증번호 생성
  const code = generateRandomCode();

  // Redis에 생성한 인증번호 + 메일 키 값 쌍 저장
  try {
    await redisService.set(`${REDIS_AUTH_EMAIL_KEY_PREFIX}${email}`, code, {
      expiration: { type: "EX", value: 180 },
    });
  } catch (error) {
    console.error("Redis 에러:", error);
    return reply.status(500).send({ message: "키 저장 실패" });
  }

  // 메일 발송
  const isSent = await mailService.sendVerificationEmail(email, code);

  if (isSent) {
    return reply.status(201).send();
  } else {
    return reply.status(500).send({ message: "메일 발송 실패" });
  }
};
