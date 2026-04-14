import { Queue } from "bullmq";
import redisService from "./redis.service";

const VIDEO_QUEUE_NAME = "video-processing";

class VideoQueueService {
  private queue: Queue;

  constructor() {
    this.queue = new Queue(VIDEO_QUEUE_NAME, {
      connection: redisService,
    });
  }
}

export const videoQueueService = new VideoQueueService();
