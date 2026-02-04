import { RouteHandler } from "fastify";
import prisma from "../services/connectors/prisma.service";
import bcrypt from "bcrypt";
import { generateRandomCode } from "../utils/generator";
import redisService from "../services/connectors/redis.service";
import mailService from "../services/mail.service";
import {
  REDIS_VERIFICATION_CHECK_KEY_PREFIX,
  REDIS_VERIFICATION_EMAIL_KEY_PREFIX,
} from "../constatns/storeKeys";

interface PostSignUpVerificationMailBody {
  email: string;
}

export const postSignUpVerificationMail: RouteHandler<{
  Body: PostSignUpVerificationMailBody;
}> = async (request, reply) => {
  const email = request.body.email;

  if (!email) {
    return reply.status(400).send({ message: "이메일을 입력해주세요." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    // 이미 사용 중인 이메일 있음
    if (existingUser) {
      return reply.status(409).send({ message: "이미 가입된 이메일입니다." });
    }
  } catch (error) {
    console.error("DB Error:", error);
    return reply.status(500).send({ message: "사용자 조회에 실패하였습니다." });
  }

  // 인증번호 생성
  const code = generateRandomCode();

  // Redis에 생성한 인증번호 + 메일 키 값 쌍 저장
  try {
    await redisService.set(REDIS_VERIFICATION_EMAIL_KEY_PREFIX(email), code, {
      expiration: { type: "EX", value: 180 },
    });
  } catch (error) {
    console.error("Redis Error:", error);
    return reply
      .status(500)
      .send({ message: "인증 키 생성에 실패하였습니다." });
  }

  // 메일 발송
  const isSent = await mailService.sendVerificationEmail(email, code);

  if (isSent) {
    return reply.status(201).send();
  } else {
    return reply.status(500).send({
      message: "메일 발송에 실패하였습니다.\n이메일 주소를 다시 확인해주세요.",
    });
  }
};

interface PostSignUpVerificationCheckBody {
  email: string;
  code: string;
}

export const postSignUpVerificationCheck: RouteHandler<{
  Body: PostSignUpVerificationCheckBody;
}> = async (request, reply) => {
  const { email, code } = request.body;

  if (!email) {
    return reply.status(400).send({ message: "이메일을 입력해주세요." });
  }

  if (!code) {
    return reply.status(409).send({ message: "코드를 입력해주세요." });
  }

  try {
    const savedCode = await redisService.get(
      REDIS_VERIFICATION_EMAIL_KEY_PREFIX(email),
    );

    if (!savedCode) {
      return reply.status(404).send({ message: "인증 정보가 없습니다" });
    }

    if (savedCode !== code) {
      return reply.status(409).send({ message: "인증 번호가 틀렸습니다" });
    }

    await redisService.unlink(REDIS_VERIFICATION_EMAIL_KEY_PREFIX(email));

    // 인증 확인 되었음을 레디스에 기록
    await redisService.set(REDIS_VERIFICATION_CHECK_KEY_PREFIX(email), 1, {
      expiration: {
        type: "EX",
        value: 600,
      },
    });

    return reply.status(200).send({ message: "인증 성공" });
  } catch (error) {
    console.error("Redis Error: ", error);
    return reply.status(500).send({ message: "서버 오류" });
  }
};

interface PostSignUpBody {
  email: string;
  password: string;
}
export const postSignUp: RouteHandler<{
  Body: PostSignUpBody;
}> = async (request, reply) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return reply.status(400).send({ message: "잘못된 요청입니다." });
  }

  try {
    // Redis 인증 완료 정보 확인
    const isVerified = await redisService.get(
      REDIS_VERIFICATION_CHECK_KEY_PREFIX(email),
    );

    if (!isVerified) {
      return reply
        .status(403)
        .send({ message: "이메일 인증이 완료되지 않았습니다." });
    }
  } catch (error) {
    console.error("Redis Error: ", error);
    return reply.status(500).send({ message: "서버 오류" });
  }

  try {
    // 중복 가입 여부 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return reply.status(409).send({ message: "이미 가입된 이메일입니다." });
    }

    /** 해싱 처리된 비밀번호 */
    const hashedPassword = await bcrypt.hash(password, 10);

    // DB에 사용자 생성
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Redis에서 키 삭제
    await redisService.unlink(REDIS_VERIFICATION_CHECK_KEY_PREFIX(email));

    return reply.status(201).send({
      message: "회원가입이 완료되었습니다.",
      userId: newUser.id,
    });
  } catch (error) {
    console.error("SignUp Error: ", error);
    return reply.status(500).send({ message: "서버 오류" });
  }
};
