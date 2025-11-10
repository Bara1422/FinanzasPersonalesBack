import type { IReportDataGenerator } from "../../repositories/interfaces/IReportDataGenerator";

export class GastosPorCategoriaReport implements IReportDataGenerator {
  async generar(transacciones: any[]): Promise<any[]> {
    const gastos = transacciones.filter((t) => t.tipo === "GASTO");

    const resumen: Record<string, number> = {};
    gastos.forEach((t) => {
      const categoria = t.categoria?.nombre || "Sin categoría";
      resumen[categoria] = (resumen[categoria] || 0) + t.monto;
    });

    return Object.entries(resumen).map(([categoria, total]) => ({
      Categoria: categoria,
      TotalGastado: total,
    }));
  }
}
