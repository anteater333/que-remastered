import { User } from "@prisma/client";
import prismaService from "./connectors/prisma.service";
import bcrypt from "bcrypt";

export type UserWithoutPassword = Omit<User, "password">;

class UserService {
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
}

export default new UserService();
