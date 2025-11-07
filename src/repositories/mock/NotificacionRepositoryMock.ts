import type { Notificacion } from "@prisma/client";
import type { INotificacionRepository } from "../interfaces/INotificacionRepository";
import { notificacionesMock } from "./data/notificacion.data";

export class NotificacionRepositoryMock
  implements INotificacionRepository<Notificacion>
{
  private notificacionesDB: Notificacion[] = notificacionesMock;

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
