import z from "zod";

export const studioHandleParamSchema = z.object({
  handle: z.string().min(1, "올바르지 않은 스튜디오 handle 형식입니다."),
});

export type StudioHandleParams = z.infer<typeof studioHandleParamSchema>;
