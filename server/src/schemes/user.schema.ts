import z from "zod";
import { FORBIDDEN_NICKNAMES } from "../../../shared/keywords";

const nicknameSchema = z
  .string()
  .trim()
  .min(2, "닉네임은 최소 2자 이상이어야 합니다.")
  .max(20, "닉네임은 20자 이하여야 합니다.")
  .regex(/^[가-힣a-zA-Z0-9_]+$/, "한글, 영문, 숫자, _만 사용할 수 있습니다.")
  .refine(
    (val) => !FORBIDDEN_NICKNAMES.has(val.toLowerCase()),
    "사용할 수 없는 닉네임입니다.",
  );

const userDescriptionSchema = z
  .string()
  .max(500, "설명은 500자 이하여야 합니다.")
  .default("");

export const postOnBoardingProfileScheme = z.object({
  nickname: nicknameSchema,
  description: userDescriptionSchema.optional(),
});

export type PostOnBoardingProfileBody = z.infer<
  typeof postOnBoardingProfileScheme
>;
