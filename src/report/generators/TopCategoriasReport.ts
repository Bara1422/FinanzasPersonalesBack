import type { IReportDataGenerator } from "../../repositories/interfaces/IReportDataGenerator";

export class TopCategoriasReport implements IReportDataGenerator {
  async generar(transacciones: any[]): Promise<any[]> {
    const resumen: Record<string, { total: number; cantidad: number }> = {};

    transacciones.forEach((t) => {
      const categoria = t.categoria?.nombre || "Sin categoría";
      if (!resumen[categoria]) resumen[categoria] = { total: 0, cantidad: 0 };

      resumen[categoria].total += t.monto;
      resumen[categoria].cantidad += 1;
    });

    const ranking = Object.entries(resumen)
      .map(([categoria, datos]) => ({
        Categoria: categoria,
        CantidadTransacciones: datos.cantidad,
        MontoTotal: datos.total,
      }))
      .sort((a, b) => b.MontoTotal - a.MontoTotal)
      .slice(0, 5);

    return ranking;
  }
}
