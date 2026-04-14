import { createClient } from "redis";
import { globalLogger } from "../../server";

class RedisService {
  private redisClient;

  constructor() {
    this.redisClient = createClient({
      url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
    });

    this.redisClient.on("connect", () => {
      globalLogger.info("Redis 연결 성공.");
    });

    this.redisClient.on("error", (error) => {
      globalLogger.error({ msg: "Redis 에러 ::", error });
    });

    this.redisClient.connect().then();
  }

  getClient() {
    return this.redisClient;
  }
}

export default new RedisService().getClient();
