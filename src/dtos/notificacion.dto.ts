import type { $Enums, Notificacion } from "@prisma/client";

export interface NotificacionDTO {
  id_notificacion: number;
  id_usuario: number;
  id_categoria: number;
  descripcion: string;
  monto: number;
  prioridad: $Enums.Prioridad;
  fecha_vencimiento: Date;
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
    fecha_vencimiento: notificacion.fecha_vencimiento,
    pagado: notificacion.pagado,
  };
}
