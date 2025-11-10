import type { Reporte } from "@prisma/client";

/**
 * Interfaz genérica para los repositorios de Reportes.
 * Implementaciones: ReportRepositoryPrisma, ReportRepositoryMock
 */
export interface IReportRepository<T = Reporte> {
  findAll(): Promise<T[]>;
  findByUserId(id_usuario: number): Promise<T[]>;
  findByIdAndUser(id: number, id_usuario: number): Promise<T | null>;
  create(data: Partial<T>, id_usuario: number): Promise<T>;
  updateByUser(id: number, data: Partial<T>, id_usuario: number): Promise<T | null>;
  deleteByUser(id: number, id_usuario: number): Promise<string>;
  getResumen(id_usuario: number): Promise<any>;
}

/**
 * Interfaz para las clases que generan datos de reportes (Balance, Categorías, etc.)
 * Implementaciones: ReportFactory -> genera según tipo de reporte.
 */
export interface IReportDataGenerator {
  generar(transacciones: any[]): Promise<any>;
}
