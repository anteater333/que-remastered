import { MultipartFile } from "@fastify/multipart";
import prismaService from "./connectors/prisma.service";
import path from "path";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { globalLogger } from "../server";
import { pipeline } from "stream/promises";
import { videoQueueService } from "./connectors/queue.service";
import { StageStatus } from "@prisma/client";
import redisService from "./connectors/redis.service";
import { string } from "zod";
import domains from "../constants/domains";

const VIDEO_SOURCE_PATH = process.env.VIDEO_SOURCE_PATH ?? "";

export const STAGE_SERVICE_ERROR_NOT_FOUND = "STAGE_NOT_FOUND";
export const STAGE_SERVICE_ERROR_ALREADY_QUEUED = "ALREADY_QUEUED";

export interface StageStatusEvent {
  status: StageStatus;
  stageId: string;
}

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
    try {
      // 1. 스테이지 존재 확인
      const stage = await prismaService.stage.findUnique({
        where: { id: stageId },
      });
      if (!stage) {
        throw new Error(STAGE_SERVICE_ERROR_NOT_FOUND);
      }
      if (!(stage.status === "INITIATED" || stage.status === "FAILED")) {
        throw new Error(STAGE_SERVICE_ERROR_ALREADY_QUEUED);
      }

      await prismaService.stage.update({
        where: { id: stageId },
        data: {
          status: "UPLOADING",
        },
      });

      const ext = path.extname(fileData.filename).toLowerCase();
      const fileName = `${stageId}${ext}`;
      const uploadPath = path.join(this.uploadDir, fileName);

      // 2. 업로드 파이프라인 생성
      await pipeline(fileData.file, createWriteStream(uploadPath));

      // 3. BullMQ 등록
      await videoQueueService.addVideoTranscodeJob({
        stageId,
        fileName,
        filePath: uploadPath,
      });

      const updatedStage = await prismaService.stage.update({
        where: { id: stageId },
        data: {
          sourceUrl: domains.MEDIA + "/" + stageId + "/master.m3u8",
          status: "QUEUED",
        },
      });

      return updatedStage;
    } catch (error) {
      if (
        ![
          STAGE_SERVICE_ERROR_ALREADY_QUEUED,
          STAGE_SERVICE_ERROR_NOT_FOUND,
        ].includes((error as any)?.message)
      ) {
        await prismaService.stage.update({
          where: { id: stageId },
          data: { status: "FAILED" },
        });
      }

      // Note. 요청 실패했을 때에도 버퍼 소비해줘야 무한대기에 걸리지 않음.
      await fileData.toBuffer();

      throw error;
    }
  }

  /** 상태 전달 SSE 동작 함수 */
  async *streamStatus(
    stageId: string,
    initialStatus: StageStatusEvent["status"],
  ): AsyncGenerator<{ event: string; data: string }> {
    // 스트림 생성과 함께 현재 상태 즉시 전송
    yield {
      event: "videoStatus",
      data: JSON.stringify({ status: initialStatus, stageId }),
    };

    // 현재 상태가 더 기다릴 것 없는 상태라면 즉시 종료
    if (initialStatus === "DONE" || initialStatus === "FAILED") return;

    const channel = `stage:${stageId}`;
    const subscriber = redisService.getSubscriberClient().duplicate();
    if (subscriber.status === "wait") await subscriber.connect();

    try {
      const nextStatus = await new Promise<string>((resolve, reject) => {
        const handler = (chan: string, message: string) => {
          if (chan === channel) {
            subscriber.off("message", handler);
            resolve(message);
          }
        };

        subscriber.on("error", (err) => {
          subscriber.off("message", handler);
          reject(err);
        });

        subscriber.on("message", handler);
        subscriber.subscribe(channel).catch(reject);
      });

      yield {
        event: "videoStatus",
        data: nextStatus,
      };
    } finally {
      // 연결 해제 처리
      await subscriber.unsubscribe(channel);
      await subscriber.quit();
    }
  }
}

export default new StageService();
