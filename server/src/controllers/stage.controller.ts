import { RouteHandler } from "fastify";
import { PatchStageBody, StageIdParams } from "../schemes/stage.schema";
import prismaService from "../services/connectors/prisma.service";
import stageService, {
  STAGE_SERVICE_ERROR_ALREADY_QUEUED,
  STAGE_SERVICE_ERROR_NOT_FOUND,
} from "../services/stage.service";

/**
 * 영상 업로드 시, 최초로 빈 스테이지 데이터를 생성한다.
 */
export const postStage: RouteHandler = async (request, reply) => {
  try {
    const newStage = await prismaService.stage.create({
      data: {
        title: "Untitled Stage",
        description: "",
        uploaderId: request.user.id,
      },
    });

    return reply
      .status(201)
      .send({ message: "스테이지가 생성되었습니다.", stageId: newStage.id });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ message: "서버 오류" });
  }
};

export const patchStage: RouteHandler<{
  Body: PatchStageBody;
  Params: StageIdParams;
}> = async (request, reply) => {
  const { description, title } = request.body;
  const { stageId } = request.params;

  try {
    const updatedStage = await prismaService.stage.update({
      where: { id: stageId },
      data: { title, description, isPublished: true },
    });

    if (!updatedStage) {
      return reply
        .status(404)
        .send({ message: "스테이지를 찾을 수 없습니다." });
    }

    return reply.status(200).send({
      message: "스테이지 정보가 업데이트되었습니다.",
      stageId: updatedStage.id,
    });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ message: "서버 오류" });
  }
};

export const postStageVideo: RouteHandler<{ Params: StageIdParams }> = async (
  request,
  reply,
) => {
  const { stageId } = request.params;

  /** 데이터 스트림 확인 */
  const fileData = await request.file();
  if (!fileData) {
    return reply
      .status(400)
      .send({ message: "업로드할 영상 파일이 없습니다." });
  }

  try {
    // 업로드 서비스 실행
    const updatedStage = await stageService.uploadVideo(stageId, fileData);

    return reply.status(200).send({
      message: "업로드가 완료되었습니다.",
      stageId: updatedStage.id,
    });
  } catch (error: any) {
    if (error?.message === STAGE_SERVICE_ERROR_NOT_FOUND) {
      return reply
        .status(404)
        .send({ message: "스테이지를 찾을 수 없습니다." });
    }

    if (error?.message === STAGE_SERVICE_ERROR_ALREADY_QUEUED) {
      return reply.status(409).send({ message: "이미 등록되었습니다." });
    }

    return reply.status(500).send({ message: "서버 오류" });
  }
};

// #region 조회 영역

export const getStage: RouteHandler<{ Params: StageIdParams }> = async (
  request,
  reply,
) => {
  const { stageId } = request.params;

  try {
    const stage = await prismaService.stage.findUnique({
      where: { id: stageId },
      select: {
        id: true,
        title: true,
        description: true,
        sourceUrl: true,
        thumbnailUrl: true,
        length: true,
        status: true,
        viewCount: true,
        uploadedAt: true,
        updatedAt: true,
        uploader: {
          select: {
            id: true,
            handle: true,
            nickname: true,
            profilePictureUrl: true,
          },
        },
      },
    });

    if (!stage) {
      return reply
        .status(404)
        .send({ message: "스테이지를 찾을 수 없습니다." });
    }

    return reply.status(200).send({ stage });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ message: "서버 오류" });
  }
};

/**
 * 영상 인코딩 완료 상태를 조회한다. (Server Side Event)
 */
export const getStageVideoStatus: RouteHandler<{
  Params: StageIdParams;
}> = async (request, reply) => {
  const { stageId } = request.params;

  try {
    const stage = await prismaService.stage.findUnique({
      where: { id: stageId },
      select: { status: true, thumbnailUrl: true, sourceUrl: true },
    });

    if (!stage) {
      return reply
        .status(404)
        .send({ message: "스테이지를 찾을 수 없습니다." });
    }

    await reply.sse.send(stageService.streamStatus(stageId, stage.status));
  } catch (error) {
    request.log.error(error);

    if (!reply.sent) return reply.status(500).send({ message: "서버 오류" });
  }
};

// #endregion
