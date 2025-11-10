import type { Reporte } from "@prisma/client";
import prisma from "../../db/prisma";
import type { ResumenReporte } from "../../types/report.types";
import type { IReportRepository } from "../interfaces/IReportDataGenerator";


export class ReportRepositoryPrisma implements IReportRepository<Reporte> {
  async findAll(): Promise<Reporte[]> {
    return prisma.reporte.findMany();
  }

  async findById(id: number): Promise<Reporte | null> {
    return prisma.reporte.findUnique({
      where: { id_reporte: id },
    });
  }

  async findByUserId(id_usuario: number): Promise<Reporte[]> {
    return prisma.reporte.findMany({
      where: { id_usuario },
    });
  }

  async create(data: Partial<Reporte>, id_usuario: number): Promise<Reporte> {
    return prisma.reporte.create({
      data: {
        id_usuario,
        titulo: data.titulo ?? "Nuevo reporte",
        descripcion: data.descripcion ?? "",
        fecha_generacion: data.fecha_generacion ?? new Date(),
      },
    });
  }

  async update(id: number, data: Partial<Reporte>): Promise<Reporte> {
    return prisma.reporte.update({
      where: { id_reporte: id },
      data,
    });
  }

  async delete(id: number): Promise<string> {
    await prisma.reporte.delete({
      where: { id_reporte: id },
    });
    return "Reporte eliminado correctamente";
  }

  async getResumen(id_usuario: number): Promise<ResumenReporte> {
    const reportes = await prisma.reporte.findMany({
      where: { id_usuario },
      orderBy: { fecha_generacion: "desc" },
    });

    const cantidadReportes = reportes.length;
    const ultimoReporte = reportes[0] || null;

    return {
      cantidadReportes,
      ultimoReporteTitulo: ultimoReporte?.titulo || "N/A",
      ultimaFechaGeneracion: ultimoReporte?.fecha_generacion || null,
    };
  }
}
