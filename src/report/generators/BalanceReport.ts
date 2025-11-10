import type { IReportDataGenerator } from "../../repositories/interfaces/IReportDataGenerator";

export class BalanceReport implements IReportDataGenerator {
  async generar(transacciones: any[]): Promise<any> {
    const ingresos = transacciones
      .filter((t) => t.tipo === "INGRESO")
      .reduce((acc, t) => acc + t.monto, 0);

    const gastos = transacciones
      .filter((t) => t.tipo === "GASTO")
      .reduce((acc, t) => acc + t.monto, 0);

    return {
      tipo: "Balance General",
      ingresos,
      gastos,
      balance: ingresos - gastos,
    };
  }
}
