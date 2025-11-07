import type { $Enums, Notificacion } from "@prisma/client";

export interface NotificacionDTO {
  id_notificacion: number;
  id_usuario: number;
  id_categoria: number;
  descripcion: string;
  monto: number;
  prioridad: $Enums.Prioridad;
  fecha_vencimiento: string;
  pagado: boolean;
}

export function toNotificacionDTO(notificacion: Notificacion): NotificacionDTO {
  return {
    id_notificacion: notificacion.id_notificacion,
    id_usuario: notificacion.id_usuario,
    id_categoria: notificacion.id_categoria,
    descripcion: notificacion.descripcion,
    monto: notificacion.monto,
    prioridad: notificacion.prioridad,
    fecha_vencimiento: notificacion.fecha_vencimiento
      .toISOString()
      .split("T")[0],
    pagado: notificacion.pagado,
  };
}
export function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Fecha inválida: ${dateString}`);
  }
  return date;
}
