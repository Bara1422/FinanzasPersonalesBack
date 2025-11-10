import type { Reporte, ResumenReporte } from "../../types/report.types";
import type { IReportRepository } from "../interfaces/IReportDataGenerator";

export class ReportRepositoryMock implements IReportRepository<Reporte> {
  private reportesDB: Reporte[] = [
    {
      id_reporte: 1,
      id_usuario: 1,
      titulo: "Reporte financiero - Junio",
      descripcion: "Resumen de ingresos y gastos de junio",
      fecha_generacion: new Date("2024-06-30"),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id_reporte: 2,
      id_usuario: 1,
      titulo: "Reporte anual - 2024",
      descripcion: "Resumen de todo el año 2024",
      fecha_generacion: new Date("2024-12-31"),
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  // Obtener todos los reportes
  async findAll(): Promise<Reporte[]> {
    return Promise.resolve(this.reportesDB);
  }

  // Obtener todos los reportes de un usuario
  async findByUserId(id_usuario: number): Promise<Reporte[]> {
    const reportes = this.reportesDB.filter((r) => r.id_usuario === id_usuario);
    return Promise.resolve(reportes);
  }

  // Crear un nuevo reporte
  async create(data: Partial<Reporte>, id_usuario: number): Promise<Reporte> {
    const newReporte: Reporte = {
      id_reporte: this.reportesDB.length + 1,
      id_usuario,
      titulo: data.titulo || "Nuevo reporte",
      descripcion: data.descripcion || "",
      fecha_generacion: data.fecha_generacion || new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.reportesDB.push(newReporte);
    return Promise.resolve(newReporte);
  }

  // 🔹 Buscar un reporte por ID y usuario
  async findByIdAndUser(id: number, id_usuario: number): Promise<Reporte | null> {
    const reporte = this.reportesDB.find(
      (r) => r.id_reporte === id && r.id_usuario === id_usuario
    );
    return Promise.resolve(reporte || null);
  }

  // Actualizar un reporte de un usuario
  async updateByUser(id: number, data: Partial<Reporte>, id_usuario: number): Promise<Reporte | null> {
    const index = this.reportesDB.findIndex(
      (r) => r.id_reporte === id && r.id_usuario === id_usuario
    );
    if (index === -1) return Promise.resolve(null);

    this.reportesDB[index] = {
      ...this.reportesDB[index],
      ...data,
      updated_at: new Date(),
    };

    return Promise.resolve(this.reportesDB[index]);
  }

  // Eliminar un reporte de un usuario
  async deleteByUser(id: number, id_usuario: number): Promise<string> {
    const initialLength = this.reportesDB.length;
    this.reportesDB = this.reportesDB.filter(
      (r) => !(r.id_reporte === id && r.id_usuario === id_usuario)
    );
    if (this.reportesDB.length === initialLength) {
      throw new Error("Reporte no encontrado o no autorizado");
    }
    return Promise.resolve("Reporte eliminado correctamente");
  }

  // Resumen de reportes del usuario
  async getResumen(id_usuario: number): Promise<ResumenReporte> {
    const reportesUsuario = this.reportesDB.filter(
      (r) => r.id_usuario === id_usuario
    );

    const cantidadReportes = reportesUsuario.length;
    const ultimoReporte =
      reportesUsuario.sort(
        (a, b) => b.fecha_generacion.getTime() - a.fecha_generacion.getTime()
      )[0] || null;

    return {
      cantidadReportes,
      ultimoReporteTitulo: ultimoReporte?.titulo || "N/A",
      ultimaFechaGeneracion: ultimoReporte?.fecha_generacion || null,
    };
  }
}
