import z from "zod";
import { RESERVED_HANDLES } from "@shared/keywords";

export const emailSchema = z.email();

export const handleSchema = z
  .string()
  .min(3, "핸들은 3자 이상이어야 합니다.")
  .max(20, "핸들은 20자 이하여야 합니다.")
  .regex(/^[a-z0-9._]+$/, "영문, 숫자, 마침표, 언더바만 가능합니다.")
  .refine((val) => /^[a-z]/.test(val), "핸들은 영문으로 시작해야 합니다.")
  .refine((val) => /[a-z0-9]$/.test(val), "핸들은 기호로 끝날 수 없습니다.")
  .refine(
    (val) => !/(\.\.|__|_\.|\._)/.test(val),
    "기호를 연속해서 사용할 수 없습니다.",
  )
  .refine(
    (val) => !RESERVED_HANDLES.includes(val.toLowerCase()),
    "사용할 수 없는 핸들입니다.",
  );

export const passwordSchema = z
  .string()
  .min(8, "비밀번호는 8자 이상이어야 합니다.")
  .max(20, "비밀번호는 20자 이하여야 합니다.")
  .regex(/[a-zA-Z]/, "영문이 포함되어야 합니다.")
  .regex(/[0-9]/, "숫자가 포함되어야 합니다.")
  .refine((val) => !/\s/.test(val), "공백을 포함할 수 없습니다.");
