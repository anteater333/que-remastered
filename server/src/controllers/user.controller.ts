import { RouteHandler } from "fastify";
import prismaService from "../services/connectors/prisma.service";

export const getMe: RouteHandler = async (request, reply) => {
  const userId = request.user.id;

  try {
    const user = await prismaService.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        nickname: true,
        handle: true,
        profilePictureUrl: true,
        role: true,
      },
    });

    if (!user) {
      return reply.code(404).send({ message: "사용자를 찾을 수 없습니다." });
    }

    return reply.code(200).send({ user });
  } catch (error) {
    request.log.error({ msg: "DB Error:", error });
    return reply.status(500).send({ message: "사용자 조회에 실패하였습니다." });
  }
};
