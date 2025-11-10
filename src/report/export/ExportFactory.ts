import { PDFExporter } from "./PDFExporter";
import { ExcelExporter } from "./ExcelExporter";

export class ExportFactory {
  static getExporter(format: string) {
    if (format === "excel") return new ExcelExporter();
    return new PDFExporter();
  }
}
