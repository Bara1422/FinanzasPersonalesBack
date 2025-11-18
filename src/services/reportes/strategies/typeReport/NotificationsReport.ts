import { notificacionService } from "../../..";
import type { IReportType } from "./IReportType";
import type { NotificationsReportData } from "./types/types";

export class NotificationsReport
  implements IReportType<NotificationsReportData>
{
  async generar(
    id_usuario: number,
  ): Promise<{ data: NotificationsReportData[]; title: string }> {
    const notificaciones =
      await notificacionService.obtenerNotificacionesUsuario(id_usuario);

    const data = notificaciones.map((notificacion) => ({
      Descripcion: notificacion.descripcion,
      Fecha: notificacion.fecha_vencimiento,
      Estado: notificacion.pagado ? "Pagado" : "Pendiente",
      Monto: notificacion.monto.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
      Prioridad: notificacion.prioridad,
    }));

    return {
      data,
      title: "Reporte de Notificaciones",
    };
  }
}
