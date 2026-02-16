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

  return { token };
};
