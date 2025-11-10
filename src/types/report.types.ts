import type { Reporte } from "@prisma/client";


export type ReporteDTO = {
  id_reporte: number;
  id_usuario: number;
  titulo: string;
  descripcion: string | null;
  fecha_generacion: string;
  created_at?: Date;
  updated_at?: Date;
};

export interface ResumenReporte {
  cantidadReportes: number;
  ultimoReporteTitulo: string;
  ultimaFechaGeneracion: Date | null;
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

    created_at: reporte.created_at?? new Date(),
    updated_at: reporte.updated_at?? new Date(),
  };
}

export type {Reporte};