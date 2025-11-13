import { z } from "zod";

export const TipoReporteEnum = z.enum(
  [
    "usuario",
    "transacciones",
    "todos_usuarios",
    "categorias",
    "notificaciones",
  ],
  {
    error: () =>
      "Tipo de reporte inválido. Los tipos válidos son: usuario, transacciones, todos_usuarios, categorias, notificaciones",
  },
);

export const FormatoReporteEnum = z.enum(["pdf", "excel"], {
  error: () =>
    "Formato de reporte inválido. Los formatos válidos son: pdf, excel",
});

export const reporteQuerySchema = z.object({
  type: TipoReporteEnum,
  format: FormatoReporteEnum,
});

export type ReporteQuery = z.infer<typeof reporteQuerySchema>;
export type TipoReporte = z.infer<typeof TipoReporteEnum>;
export type FormatoReporte = z.infer<typeof FormatoReporteEnum>;
