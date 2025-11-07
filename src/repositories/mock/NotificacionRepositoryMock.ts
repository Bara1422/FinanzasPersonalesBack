import { $Enums, type Notificacion } from "@prisma/client";
import type { INotificacionRepository } from "../interfaces/INotificacionRepository";

export class NotificacionRepositoryMock
  implements INotificacionRepository<Notificacion>
{
  private notificacionesDB: Notificacion[] = [
    {
      id_notificacion: 1,
      id_usuario: 1,
      id_categoria: 1, // Alimentos
      monto: 2500,
      descripcion: "Compra supermercado",
      fecha_vencimiento: new Date("2025-10-01"),
      pagado: false,
      prioridad: $Enums.Prioridad.MEDIA,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id_notificacion: 2,
      id_usuario: 1,
      id_categoria: 2,
      monto: 800,
      pagado: false,
      prioridad: $Enums.Prioridad.MEDIA,
      created_at: new Date(),
      updated_at: new Date(),
      descripcion: "Nafta",
      fecha_vencimiento: new Date("2025-10-03"),
    },
    {
      id_notificacion: 3,
      id_usuario: 1,
      id_categoria: 1, // Alimentos
      monto: 1200,
      pagado: false,
      prioridad: $Enums.Prioridad.MEDIA,
      created_at: new Date(),
      updated_at: new Date(),
      descripcion: "Restaurante",
      fecha_vencimiento: new Date("2025-10-04"),
    },
    {
      id_notificacion: 4,
      id_usuario: 1,
      id_categoria: 8, // Tecnología
      monto: 6000,
      pagado: false,
      prioridad: $Enums.Prioridad.MEDIA,
      created_at: new Date(),
      updated_at: new Date(),
      descripcion: "Mouse gamer",
      fecha_vencimiento: new Date("2025-10-06"),
    },
    {
      id_notificacion: 5,
      id_usuario: 2,
      id_categoria: 3, // Vivienda
      monto: 20000,
      descripcion: "Alquiler",
      pagado: false,
      prioridad: $Enums.Prioridad.MEDIA,
      created_at: new Date(),
      updated_at: new Date(),
      fecha_vencimiento: new Date("2025-10-02"),
    },
    {
      id_notificacion: 6,
      id_usuario: 2,
      id_categoria: 1, // Alimentos
      monto: 5000,
      pagado: false,
      prioridad: $Enums.Prioridad.MEDIA,
      created_at: new Date(),
      updated_at: new Date(),
      descripcion: "Supermercado",
      fecha_vencimiento: new Date("2025-10-03"),
    },
    {
      id_notificacion: 7,
      id_usuario: 1,
      id_categoria: 11, // Sueldo
      monto: 5000,
      descripcion: "Sueldo mensual",
      pagado: false,
      prioridad: $Enums.Prioridad.MEDIA,
      created_at: new Date(),
      updated_at: new Date(),
      fecha_vencimiento: new Date("2025-10-01"),
    },
  ];

  async findAll(): Promise<Notificacion[]> {
    return Promise.resolve(this.notificacionesDB);
  }

  async findById(id: number): Promise<Notificacion | null> {
    const notificacion = this.notificacionesDB.find(
      (n) => n.id_notificacion === id,
    );
    return Promise.resolve(notificacion || null);
  }
  async findByUserId(id_usuario: number): Promise<Notificacion[]> {
    const notificaciones = this.notificacionesDB.filter(
      (n) => n.id_usuario === id_usuario,
    );
    return Promise.resolve(notificaciones);
  }

  async findPendingByUserId(id_usuario: number): Promise<Notificacion[]> {
    const notificaciones = this.notificacionesDB.filter(
      (n) => n.id_usuario === id_usuario && !n.pagado,
    );
    return Promise.resolve(notificaciones);
  }
  async create(
    data: Partial<Notificacion>,
    id_usuario: number,
  ): Promise<Notificacion> {
    const newNotificacion: Notificacion = {
      id_notificacion: this.notificacionesDB.length + 1,
      id_usuario: id_usuario,
      id_categoria: data.id_categoria,
      monto: data.monto,
      descripcion: data.descripcion,
      prioridad: data.prioridad,
      fecha_vencimiento: data.fecha_vencimiento,
      pagado: false,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.notificacionesDB.push(newNotificacion);
    return Promise.resolve(newNotificacion);
  }

  async update(id: number, data: Partial<Notificacion>): Promise<Notificacion> {
    const index = this.notificacionesDB.findIndex(
      (n) => n.id_notificacion === id,
    );
    if (index === -1) throw new Error("Notificacion no encontrada");
    const updatedNotificacion = {
      ...this.notificacionesDB[index],
      ...data,
      updated_at: new Date(),
    };
    this.notificacionesDB[index] = updatedNotificacion;
    return Promise.resolve(updatedNotificacion);
  }

  async delete(id: number): Promise<string> {
    this.notificacionesDB = this.notificacionesDB.filter(
      (n) => n.id_notificacion !== id,
    );
    return Promise.resolve("Notificación eliminada correctamente");
  }
  async markAsPaid(id: number): Promise<Notificacion | null> {
    const index = this.notificacionesDB.findIndex(
      (n) => n.id_notificacion === id,
    );
    if (index === -1) throw new Error("Notificacion no encontrada");

    if (this.notificacionesDB[index].pagado) {
      throw new Error("La notificación ya está marcada como pagada");
    }
    const updatedNotificacion = {
      ...this.notificacionesDB[index],
      pagado: true,
      updated_at: new Date(),
    };
    this.notificacionesDB[index] = updatedNotificacion;
    return Promise.resolve(updatedNotificacion);
  }
}
