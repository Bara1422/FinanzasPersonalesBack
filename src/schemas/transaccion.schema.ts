import { z } from "zod";
import { atLeastOne } from "./atLeastOne.schema";

export const transaccionBaseSchema = z.object({
  descripcion: z.string().min(1, "La descripción es requerida"),
  monto: z.coerce
    .number("El monto debe ser un número")
    .positive("El monto debe ser un número positivo"),
  id_categoria: z.coerce
    .number("Falta el id de categoria")
    .int("El ID de categoría debe ser un número entero")
    .positive("El ID de categoría debe ser un número entero positivo"),
});

export const createTransaccionSchema = transaccionBaseSchema;
export const updateTransaccionSchema = atLeastOne(transaccionBaseSchema);

export type CreateTransaccion = z.infer<typeof createTransaccionSchema>;
export type UpdateTransaccion = z.infer<typeof updateTransaccionSchema>;
