import { ExcelReportFormat } from "../strategies/formatReport/ExcelReportFormat";
import { PDFReportFormat } from "../strategies/formatReport/PDFReportFormat";

export class ReportFormatFactory {
  static create(format: "pdf" | "excel") {
    switch (format) {
      case "pdf":
        return new PDFReportFormat();
      case "excel":
        return new ExcelReportFormat();
      default:
        throw new Error(`Formato de reporte no soportado: ${format}`);
    }
  }
}
