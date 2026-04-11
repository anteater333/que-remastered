import z from "zod";

const titleSchema = z
  .string()
  .min(1, "제목은 최소 1자 이상이어야 합니다.")
  .max(100, "제목은 100자 이하여야 합니다.")
  .trim();

const descriptionSchema = z
  .string()
  .max(2000, "설명은 2000자 이하여야 합니다.")
  .default("");

export const postStageSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
});

export type PostStageBody = z.infer<typeof postStageSchema>;
