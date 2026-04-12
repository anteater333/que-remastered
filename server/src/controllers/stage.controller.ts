import { RouteHandler } from "fastify";
import { PostStageBody } from "../schemes/stage.schema";
import prismaService from "../services/connectors/prisma.service";

export const postStage: RouteHandler<{
  Body: PostStageBody;
}> = async (request, reply) => {
  const { description, title } = request.body; // Note. zod 통해 검증 완료

  try {
    const newStage = await prismaService.stage.create({
      data: { title, description, uploaderId: request.user.id },
    });

    return reply
      .status(201)
      .send({ message: "스테이지가 생성되었습니다.", stageId: newStage.id });
  } catch (error) {
    request.log.error({ error });
    return reply.status(500).send({ message: "서버 오류" });
  }
};
