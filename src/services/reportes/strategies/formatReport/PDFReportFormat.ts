import { pdfGenerator } from "../../../../utils/PDFExporter";
import type { ReportData } from "../typeReport/types/types";
import type { IReportFormat } from "./IReportFormat";

export class PDFReportFormat implements IReportFormat<ReportData> {
  async export(data: ReportData[], title: string): Promise<Buffer> {
    return await pdfGenerator(data, title);
  }
}
