import type { $Enums, Notificacion } from "@prisma/client";
import prisma from "../../db/prisma";
import { CustomError } from "../../utils/CustomError";
import type { INotificacionRepository } from "../interfaces/INotificacionRepository";

export class NotificacionRepositoryPrisma
  implements INotificacionRepository<Notificacion>
{
  async findAll(): Promise<Notificacion[]> {
    return await prisma.notificacion.findMany();
  }

  async findById(id: number): Promise<Notificacion | null> {
    return await prisma.notificacion.findUnique({
      where: { id_notificacion: id },
    });
  }
  async findByUserId(id_usuario: number): Promise<Notificacion[]> {
    return await prisma.notificacion.findMany({
      where: { id_usuario },
    });
  }
  async findPendingByUserId(id_usuario: number): Promise<Notificacion[]> {
    return await prisma.notificacion.findMany({
      where: { id_usuario, pagado: false },
    });
  }
  async findPaidByUserId(id_usuario: number): Promise<Notificacion[]> {
    return await prisma.notificacion.findMany({
      where: { id_usuario, pagado: true },
    });
  }
  async create(
    data: Partial<Notificacion>,
    id_usuario: number,
  ): Promise<Notificacion> {
    const newNotificacion = await prisma.notificacion.create({
      data: {
        id_usuario: id_usuario,
        id_categoria: data.id_categoria as number,
        monto: data.monto as number,
        descripcion: data.descripcion as string,
        prioridad: data.prioridad as $Enums.Prioridad,
        fecha_vencimiento: data.fecha_vencimiento as Date,
        pagado: false,
      },
    });
    return newNotificacion;
  }

  async update(id: number, data: Partial<Notificacion>): Promise<Notificacion> {
    const notificacionToUpdate = await this.findById(id);
    if (!notificacionToUpdate) {
      throw new CustomError("Notificación no encontrada", 404);
    }

    const updatedNotificacion = await prisma.notificacion.update({
      where: { id_notificacion: id },
      data: {
        id_categoria: data.id_categoria ?? notificacionToUpdate.id_categoria,
        monto: data.monto ?? notificacionToUpdate.monto,
        descripcion: data.descripcion ?? notificacionToUpdate.descripcion,
        prioridad: data.prioridad ?? notificacionToUpdate.prioridad,
        fecha_vencimiento:
          data.fecha_vencimiento ?? notificacionToUpdate.fecha_vencimiento,
        pagado: data.pagado ?? notificacionToUpdate.pagado,
        updated_at: new Date(),
      },
    });

    return updatedNotificacion;
  }
  async delete(id: number): Promise<string> {
    await prisma.notificacion.delete({ where: { id_notificacion: id } });
    return `Notificación con id ${id} eliminada correctamente.`;
  }

  async markAsPaid(id: number): Promise<Notificacion | null> {
    const notificacion = await this.findById(id);
    if (!notificacion) {
      return null;
    }
    if (notificacion.pagado) {
      throw new CustomError("Notificación ya está marcada como pagada", 400);
    }

    const updatedNotificacion = await prisma.notificacion.update({
      where: { id_notificacion: id },
      data: { pagado: true, updated_at: new Date() },
    });
    return updatedNotificacion;
  }
}
