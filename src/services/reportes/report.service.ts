import { ReportFormatFactory } from "./factories/ReportFormatFactory";
import { ReportTypeFactory } from "./factories/ReportTypeFactory";

export class ReportService {
  static async generateReport(
    type: string,
    format: "pdf" | "excel",
    id_usuario: number,
  ) {
    const dataStrategy = ReportTypeFactory.getReportType(type);
    const { data, title } = await dataStrategy.generar(id_usuario);
    const formatStrategy = ReportFormatFactory.create(format);

    return await formatStrategy.export(data, title);
  }
}
