import { RouteHandler } from "fastify";
import prismaService from "../services/connectors/prisma.service";
import { PostOnBoardingProfileBody } from "../schemes/user.schema";
import { Prisma } from "@prisma/client";

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
    request.log.error(error);
    return reply.status(500).send({ message: "사용자 조회에 실패하였습니다." });
  }
};

// #region onboarding 관련 API 모음
export const postOnBoardingProfile: RouteHandler<{
  Body: PostOnBoardingProfileBody;
}> = async (request, reply) => {
  const userId = request.user.id;
  const { nickname, description, profilePictureUrl } = request.body;

  try {
    const updatedUser = await prismaService.user.update({
      where: { id: userId },
      data: {
        nickname,
        description: description ? description : Prisma.skip,
        profilePictureUrl: profilePictureUrl ? profilePictureUrl : Prisma.skip,
      },
    });

    if (!updatedUser) {
      return reply.code(404).send({ message: "사용자를 찾을 수 없습니다." });
    }

    return reply.code(200).send({ updatedUser });
  } catch (error) {
    request.log.error(error);
    return reply
      .status(500)
      .send({ message: "사용자 프로필 등록에 실패하였습니다." });
  }
};
// #endregion
