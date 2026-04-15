import { Queue } from "bullmq";
import redisService from "./redis.service";

const VIDEO_QUEUE_NAME = "video-processing";
const VIDEO_QUEUE_JOB_NAME = "process-video";

class VideoQueueService {
  private queue: Queue;

  constructor() {
    this.queue = new Queue(VIDEO_QUEUE_NAME, {
      connection: redisService,
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 3,
        backoff: { type: "exponential", delay: 1000 },
      },
    });
  }

  /**
   * 영상 가공 작업 요청 대기열 등록
   */
  async addVideoTranscodeJob(data: {
    stageId: string;
    filePath: string;
    fileName: string;
  }) {
    return await this.queue.add(VIDEO_QUEUE_JOB_NAME, data);
  }
}

export const videoQueueService = new VideoQueueService();
