import type { IReportDataGenerator } from "../../repositories/interfaces/IReportDataGenerator";

export class IngresosGastosMensualReport implements IReportDataGenerator {
  async generar(transacciones: any[]): Promise<any[]> {
    const resumen: Record<string, { Ingresos: number; Gastos: number }> = {};

    transacciones.forEach((t) => {
      const fecha = new Date(t.created_at);
      const mes = fecha.toLocaleString("es-ES", { month: "long", year: "numeric" });

      if (!resumen[mes]) resumen[mes] = { Ingresos: 0, Gastos: 0 };

      if (t.tipo === "INGRESO") resumen[mes].Ingresos += t.monto;
      else if (t.tipo === "GASTO") resumen[mes].Gastos += t.monto;
    });

    return Object.entries(resumen).map(([mes, valores]) => ({
      Mes: mes,
      Ingresos: valores.Ingresos,
      Gastos: valores.Gastos,
      Balance: valores.Ingresos - valores.Gastos,
    }));
  }
}
