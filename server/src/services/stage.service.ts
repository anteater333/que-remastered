import { MultipartFile } from "@fastify/multipart";
import prismaService from "./connectors/prisma.service";

export const STAGE_SERVICE_ERROR_NOT_FOUND = "STAGE_NOT_FOUND";

class StageService {
  async uploadVideo(stageId: string, fileData: MultipartFile) {
    // 1. 스테이지 존재 확인
    const stage = await prismaService.stage.findUnique({
      where: { id: stageId },
    });
    if (!stage) {
      throw new Error(STAGE_SERVICE_ERROR_NOT_FOUND);
    }
  }
}

export default new StageService();
