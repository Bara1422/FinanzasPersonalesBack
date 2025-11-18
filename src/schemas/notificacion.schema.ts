import { z } from "zod";
import { atLeastOne } from "./atLeastOne.schema";

export const notificacionBaseSchema = z.object({
  descripcion: z.string().min(1, "La descripción es requerida"),
  monto: z.coerce
    .number("El monto debe ser un número")
    .positive("El monto debe ser un número positivo"),
  fecha_vencimiento: z
    .string({
      error: () => "Falta la fecha de vencimiento",
    })
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: "La fecha de vencimiento debe ser una fecha válida",
    }),
  id_categoria: z.coerce
    .number({
      error: () => "Falta el id de categoria",
    })
    .int("El ID de categoría debe ser un número entero")
    .positive("El ID de categoría debe ser un número entero positivo")
    .min(1, "Falta el ID de categoría"),
  prioridad: z.enum(["BAJA", "MEDIA", "ALTA"], {
    error: () => "Selecciona una prioridad válida: BAJA, MEDIA o ALTA",
  }),
});

export const createNotificacionSchema = notificacionBaseSchema;
export const updateNotificacionSchema = atLeastOne(notificacionBaseSchema);

export type CreateNotificacion = z.infer<typeof createNotificacionSchema>;
export type UpdateNotificacion = z.infer<typeof updateNotificacionSchema>;
