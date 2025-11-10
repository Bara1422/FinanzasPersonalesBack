import { BalanceReport } from "./generators/BalanceReport";
import { GastosPorCategoriaReport } from "./generators/GastosPorCategoriaReport";
import { IngresosGastosMensualReport } from "./generators/IngresosGastosMensualReport";
import { TopCategoriasReport } from "./generators/TopCategoriasReport";
import type { IReportDataGenerator } from "../repositories/interfaces/IReportDataGenerator";

export class ReportFactory {
  static createReport(type: string): IReportDataGenerator {
    switch (type) {
      case "balance":
        return new BalanceReport();
      case "gastosPorCategoria":
        return new GastosPorCategoriaReport();
      case "ingresosGastosMensual":
        return new IngresosGastosMensualReport();
      case "topCategorias":
        return new TopCategoriasReport();
      default:
        throw new Error(`Tipo de reporte no válido: ${type}`);
    }
  }
}
