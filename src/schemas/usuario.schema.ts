import { z } from "zod";
import { atLeastOne } from "./atLeastOne.schema";

export const usuarioBaseSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z.email("El email debe ser válido"),
  password: z
    .string("La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  username: z
    .string("El nombre de usuario es requerido")
    .min(3, "El nombre de usuario no puede tener menos de 3 caracteres")
    .max(20, "El nombre de usuario no puede exceder los 20 caracteres"),
});

export const createUsuarioSchema = usuarioBaseSchema;
export const updateUsuarioSchema = atLeastOne(usuarioBaseSchema);

export type CreateUsuario = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuario = z.infer<typeof updateUsuarioSchema>;
