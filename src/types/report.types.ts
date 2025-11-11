export interface Reporte {
  id_reporte: number;
  id_usuario: number;
  titulo: string;
  descripcion: string | null;
  fecha_generacion: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ResumenReporte {
  cantidadReportes: number;
  ultimoReporteTitulo: string;
  ultimaFechaGeneracion: Date | null;
}
