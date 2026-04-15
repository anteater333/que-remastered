import fp from "fastify-plugin";
import multipart from "@fastify/multipart";

/**
 * 허용 업로드 파일 크기 한도
 * 10GB
 */
const UPLOAD_FILE_LIMIT = 10 * 1024 * 1024 * 1024 * 1024;

/** 영상 업로드 기능을 위한 Multipart 미들웨어 설정 */
const multipartPlugin = fp(async (fastify) => {
  fastify.register(multipart, {
    limits: {
      fieldNameSize: 100,
      fieldSize: 100,
      fields: 10,
      fileSize: UPLOAD_FILE_LIMIT,
      files: 1,
    },
  });
});

export default multipartPlugin;
