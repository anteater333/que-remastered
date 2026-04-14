import { MultipartFile } from "@fastify/multipart";
import prismaService from "./connectors/prisma.service";
import path from "path";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { globalLogger } from "../server";
import { pipeline } from "stream/promises";

const VIDEO_SOURCE_PATH = process.env.VIDEO_SOURCE_PATH ?? "";

export const STAGE_SERVICE_ERROR_NOT_FOUND = "STAGE_NOT_FOUND";

class StageService {
  /** 업로드 경로 */
  uploadDir: string;
  constructor() {
    this.uploadDir = VIDEO_SOURCE_PATH;
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
    globalLogger.info("Stage 서비스 생성.");
  }

  async uploadVideo(stageId: string, fileData: MultipartFile) {
    // 1. 스테이지 존재 확인
    const stage = await prismaService.stage.findUnique({
      where: { id: stageId },
    });
    if (!stage) {
      throw new Error(STAGE_SERVICE_ERROR_NOT_FOUND);
    }

    const ext = path.extname(fileData.filename).toLowerCase();
    const fileName = `${stageId}${ext}`;
    const uploadPath = path.join(this.uploadDir, fileName);

    try {
      // 업로드 파이프라인 생성
      await pipeline(fileData.file, createWriteStream(uploadPath));

      const updatedStage = await prismaService.stage.update({
        where: { id: stageId },
        data: {
          sourceUrl: uploadPath, // TODO: 임시 코드, 실제로는 원본 영상은 사용자 단에서 안쓰임
          status: "PROCESSING",
        },
      });

      // TODO: BullMQ 등록

      return updatedStage;
    } catch (error) {
      await prismaService.stage.update({
        where: { id: stageId },
        data: { status: "FAILED" },
      });
      throw error;
    }
  }
}

export default new StageService();
