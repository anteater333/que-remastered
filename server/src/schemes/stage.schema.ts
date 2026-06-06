import z from "zod";
import { STAGE_SORT } from "@shared/filters";

const titleSchema = z
  .string()
  .min(1, "제목은 최소 1자 이상이어야 합니다.")
  .max(100, "제목은 100자 이하여야 합니다.")
  .trim();

const descriptionSchema = z
  .string()
  .max(2000, "설명은 2000자 이하여야 합니다.")
  .default("");

export const stageIdParamSchema = z.object({
  stageId: z.cuid("올바르지 않은 스테이지 ID 형식입니다."),
});

export const patchStageSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
});

export type PatchStageBody = z.infer<typeof patchStageSchema>;

export type StageIdParams = z.infer<typeof stageIdParamSchema>;

export const getStageListQuerySchema = z.object({
  cursor: z.cuid("올바르지 않은 커서 형식입니다.").optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sort: z
    .enum(Object.values(STAGE_SORT) as [string, ...string[]])
    .default(STAGE_SORT.LATEST),
});

export type GetStageListQuery = z.infer<typeof getStageListQuerySchema>;
