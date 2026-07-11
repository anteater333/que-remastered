import { User } from "@prisma/client";
import prismaService from "./connectors/prisma.service";
import bcrypt from "bcrypt";
import { globalLogger } from "../server";
import { MultipartFile } from "@fastify/multipart";
import sharp from "sharp";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import domains from "../constants/domains";

export type UserWithoutPassword = Omit<User, "password">;

/** 프로필 이미지 업로드 경로 */
const PROFILE_UPLOAD_PATH = process.env.PROFILE_UPLOAD_PATH ?? "";

export const USER_SERVICE_ERROR_NOT_FOUND = "USER_NOT_FOUND";

class UserService {
  constructor() {
    if (!existsSync(PROFILE_UPLOAD_PATH)) {
      mkdirSync(PROFILE_UPLOAD_PATH, { recursive: true });
    }
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

      const processedImage = await sharp(buffer)
        .resize(512, 512, { fit: "cover", position: "center" })
        .toFormat("webp")
        .toBuffer();

      const fileName = `${userId}.webp`;
      const uploadPath = path.join(PROFILE_UPLOAD_PATH, fileName);

      await writeFile(uploadPath, processedImage);

      const updatedUser = await prismaService.user.update({
        where: { id: userId },
        data: {
          profilePictureUrl: `${domains.MEDIA}/profile/${fileName}`,
        },
      });

      return updatedUser.profilePictureUrl;
    } catch (error) {
      await fileData.toBuffer();

      throw error;
    }
  }
}

export default new UserService();
