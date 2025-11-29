import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("El email debe ser válido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "El token es requerido"),
  password: z
    .string("La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
