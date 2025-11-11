import { excelGenerator } from "../../../../utils/ExcelExporter";
import type { ReportData } from "../typeReport/types/types";
import type { IReportFormat } from "./IReportFormat";

export class ExcelReportFormat implements IReportFormat<ReportData> {
  async export(data: ReportData[], title: string): Promise<Buffer> {
    return await excelGenerator(data, title);
  }
}
