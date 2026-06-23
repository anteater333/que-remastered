import { User } from "@prisma/client";
import prismaService from "./connectors/prisma.service";
import bcrypt from "bcrypt";
import { globalLogger } from "../server";
import { MultipartFile } from "@fastify/multipart";
import sharp from "sharp";
import { writeFile } from "fs/promises";

export type UserWithoutPassword = Omit<User, "password">;

class UserService {
  constructor() {
    globalLogger.info("User 서비스 생성.");
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async uploadProfileImage(userId: string, fileData: MultipartFile) {
    try {
      const buffer = await fileData.toBuffer();

      const processed = await sharp(buffer)
        .resize(512, 512, { fit: "cover", position: "center" })
        .toFormat("webp")
        .toBuffer();

      const filename = `${userId}.webp`;
      const filepath = `/home/anteater/projects/que-remastered/server/dist/tmp/${filename}`; // 동작 확인용 개발 환경 임시 경로

      await writeFile(filepath, processed);
    } catch (error) {}
  }
}

export default new UserService();
