import z from "zod";

export const studioIdParamSchema = z.object({
  studioId: z.uuid("올바르지 않은 스튜디오 ID 형식입니다."),
});

export type StudioIdParams = z.infer<typeof studioIdParamSchema>;
