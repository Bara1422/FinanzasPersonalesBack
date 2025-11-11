import type { Reporte } from "../types/report.types";

export interface ReporteDTO {
  id_reporte: number;
  id_usuario: number;
  titulo: string;
  descripcion: string | null;
  fecha_generacion: string;
}

export function toReporteDTO(reporte: Reporte): ReporteDTO {
  return {
    id_reporte: reporte.id_reporte,
    id_usuario: reporte.id_usuario,
    titulo: reporte.titulo,
    descripcion: reporte.descripcion,
    fecha_generacion: reporte.fecha_generacion
      ? new Date(reporte.fecha_generacion).toISOString().split("T")[0]
      : "",
  };
}
