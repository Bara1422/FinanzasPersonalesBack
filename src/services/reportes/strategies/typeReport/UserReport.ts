import { transaccionService, userService } from "../../..";
import type { IReportType } from "./IReportType";
import type { UserReportData } from "./types/types";

export class UserReport implements IReportType<UserReportData> {
  async generar(
    id_usuario: number,
  ): Promise<{ data: UserReportData[]; title: string }> {
    const user = await userService.findById(id_usuario);

    const summary =
      await transaccionService.obtenerResumenFinanciero(id_usuario);

    const data = [
      {
        Usuario: user.nombre,
        Email: user.email,
        Username: user.username,
        Fecha_creacion: user.created_at,
        Gastos_ultimo_mes: summary.resumenMensual.gastos,
        Ingresos_ultimo_mes: summary.resumenMensual.ingresos,
        Balance_ultimo_mes: summary.resumenMensual.balance,
        Total_ingresos: summary.resumenTotal.ingresos,
        Total_gastos: summary.resumenTotal.gastos,
        Balance: summary.resumenTotal.balance,
        Total_transacciones: summary.cantidadTransacciones,
      },
    ];
    return { data, title: "Resumen del usuario" };
  }
}
