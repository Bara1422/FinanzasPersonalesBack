import { ExportFactory } from "../report/export/ExportFactory";
import { ReportFactory } from "../report/ReportFactory";
import type { IReportRepository } from "../repositories/interfaces/IReportDataGenerator";
import type { ITransaccionRepository } from "../repositories/interfaces/ITransaccionRepository";
import type { Transaccion, Reporte } from "@prisma/client";
import type { ResumenReporte } from "../types/report.types";

export class ReportService {
  constructor(
    private reportRepo: IReportRepository<Reporte>,
    private transaccionRepo: ITransaccionRepository<Transaccion>
  ) {}

  async createReport(data: Partial<Reporte>, id_usuario: number): Promise<Reporte> {
    const report = await this.reportRepo.create(data, id_usuario);
    return report;
  }

  async getAllReports(): Promise<Reporte[]> {
    return this.reportRepo.findAll();
  }

  async getUserReports(id_usuario: number): Promise<Reporte[]> {
    return this.reportRepo.findByUserId(id_usuario);
  }

  async getReportById(id: number, id_usuario: number): Promise<Reporte | null> {
  return this.reportRepo.findByIdAndUser(id, id_usuario);
}

  async updateReport(id: number, data: Partial<Reporte>, id_usuario: number): Promise<Reporte | null> {
  return this.reportRepo.updateByUser(id, data, id_usuario);
}


  async deleteReport(id: number, id_usuario: number): Promise<string> {
  return this.reportRepo.deleteByUser(id, id_usuario);
}

  async getReportSummary(id_usuario: number): Promise<ResumenReporte> {
    return this.reportRepo.getResumen(id_usuario);
  }

  async generateReport(type: string, format: string, id_usuario: number): Promise<any> {
    const transacciones = await this.transaccionRepo.findByUserId(id_usuario);

    const reportDataGenerator = ReportFactory.createReport(type);
    if (!reportDataGenerator?.generar)
      throw new Error(`Tipo de reporte no soportado: ${type}`);

    const reportData = await reportDataGenerator.generar(transacciones);

    const exporter = ExportFactory.getExporter(format);
    if (!exporter?.exportar)
      throw new Error(`Formato de exportación no soportado: ${format}`);

    return exporter.exportar(reportData);
  }
}
