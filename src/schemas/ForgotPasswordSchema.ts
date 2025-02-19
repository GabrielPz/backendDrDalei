import { z } from "zod";

export const requestTokenSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase()),
});

export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
  email: z
    .string()
    .email()
    .transform((v) => v.toLowerCase()),
});



export type RequestTokenDTO = z.infer<typeof requestTokenSchema>;
export type ResetPasswordSchemaDTO = z.infer<typeof resetPasswordSchema>;
