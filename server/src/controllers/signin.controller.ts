import { RouteHandler } from "fastify";
import userService from "../services/user.service";

interface PostSignInBody {
  email: string;
  password: string;
}

export const postSignIn: RouteHandler<{ Body: PostSignInBody }> = async (
  request,
  reply,
) => {
  const { email, password } = request.body;

  if (!email) {
    return reply.status(400).send({ message: "이메일을 입력해주세요." });
  }

  if (!password) {
    return reply.status(400).send({ message: "비밀번호를 입력해주세요." });
  }

  const user = await userService.validateUser(email, password);

  if (!user) {
    return reply.code(401).send({ message: "인증 정보가 올바르지 않습니다." });
  }

  const token = request.server.jwt.sign({ id: user.id, email: user.email });

  return reply
    .code(200)
    .setCookie("accessToken", token, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      signed: true,
      maxAge: 60 * 60 * 24 * 7,
    })
    .send({ message: "로그인 되었습니다." });
};

export const postSignOut: RouteHandler = async (request, reply) => {
  return reply
    .clearCookie("accessToken", {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      signed: true,
    })
    .code(200)
    .send({ message: "로그아웃 되었습니다." });
};
