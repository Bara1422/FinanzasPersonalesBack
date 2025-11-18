import { transaccionService, userService } from "../../..";
import type { IReportType } from "./IReportType";
import type { UserReportData } from "./types/types";

export class AllUsersReport implements IReportType<UserReportData> {
  async generar(
    id_usuario: number,
  ): Promise<{ data: UserReportData[]; title: string }> {
    const requestUser = await userService.findById(id_usuario);

    if (!requestUser) {
      throw new Error("Usuario no encontrado");
    }

    if (requestUser.rol !== "ADMIN") {
      throw new Error("No autorizado para generar este reporte");
    }

    const users = await userService.getAll();

    const data = await Promise.all(
      users.map(async (user) => {
        const summary = await transaccionService.obtenerResumenFinanciero(
          user.id_usuario,
        );

        return {
          Usuario: user.nombre,
          Email: user.email,
          Username: user.username,
          Fecha_creacion: user.created_at,
          Gastos_ultimo_mes: summary.resumenMensual.gastos.toLocaleString(
            "es-AR",
            {
              style: "currency",
              currency: "ARS",
            },
          ),
          Ingresos_ultimo_mes: summary.resumenMensual.ingresos.toLocaleString(
            "es-AR",
            {
              style: "currency",
              currency: "ARS",
            },
          ),
          Balance_ultimo_mes: summary.resumenMensual.balance.toLocaleString(
            "es-AR",
            {
              style: "currency",
              currency: "ARS",
            },
          ),
          Total_ingresos: summary.resumenTotal.ingresos.toLocaleString(
            "es-AR",
            {
              style: "currency",
              currency: "ARS",
            },
          ),
          Total_gastos: summary.resumenTotal.gastos.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          }),
          Balance: summary.resumenTotal.balance.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          }),
          Total_transacciones: summary.cantidadTransacciones,
        };
      }),
    );

    return {
      data,
      title: "Resumen de Todos los Usuarios",
    };
  }
}
