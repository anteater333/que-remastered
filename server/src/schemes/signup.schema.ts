import z from "zod";
import { emailSchema, handleSchema, passwordSchema } from ".";

export const postSignUpVerificationMailSchema = z.object({
  email: emailSchema,
});
export type PostSignUpVerificationMailBody = z.infer<
  typeof postSignUpVerificationMailSchema
>;

export const postSignUpVerificationCheckSchema = z.object({
  email: emailSchema,
  code: z.string(),
});
export type PostSignUpVerificationCheckBody = z.infer<
  typeof postSignUpVerificationCheckSchema
>;

export const postSignUpSchema = z.object({
  email: emailSchema,
  handle: handleSchema,
  password: passwordSchema,
});
export type PostSignUpBody = z.infer<typeof postSignUpSchema>;
