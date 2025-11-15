import type { FormatoReporte, TipoReporte } from "../../schemas/reporte.schema";
import { CustomError } from "../../utils/CustomError";
import { ReportFormatFactory } from "./factories/ReportFormatFactory";
import { ReportTypeFactory } from "./factories/ReportTypeFactory";

export class ReportService {
  static async generateReport(
    type: TipoReporte,
    format: FormatoReporte,
    id_usuario: number,
  ) {
    const dataStrategy = ReportTypeFactory.getReportType(type);
    if (!dataStrategy) {
      throw new CustomError(`Tipo de reporte inválido ${type}`, 400);
    }

    const { data, title } = await dataStrategy.generar(id_usuario);

    const formatStrategy = ReportFormatFactory.create(format);
    if (!formatStrategy) {
      throw new CustomError(`Formato de reporte inválido ${format}`, 400);
    }

    return await formatStrategy.export(data, title);
  }
}
