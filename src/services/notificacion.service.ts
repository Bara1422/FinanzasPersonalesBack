import type { Notificacion } from "@prisma/client";
import {
  type NotificacionDTO,
  parseDate,
  toNotificacionDTO,
} from "../dtos/notificacion.dto";
import type { INotificacionRepository } from "../repositories/interfaces/INotificacionRepository";

export class NotificacionService {
  constructor(
    private notificacionRepository: INotificacionRepository<Notificacion>,
  ) {}

  async crearNotificacion(data: Partial<NotificacionDTO>, id_usuario: number) {
    if (!id_usuario) {
      throw new Error("Falta el ID del usuario");
    }

    if (!data.monto || data.monto <= 0) {
      throw new Error("El monto debe ser mayor que 0");
    }
    if (!data.fecha_vencimiento) {
      throw new Error("La fecha de vencimiento es obligatoria");
    }

    const dataConFecha: Partial<Notificacion> = {
      ...data,
      fecha_vencimiento: parseDate(data.fecha_vencimiento),
    };

    const nuevaNotificacion = await this.notificacionRepository.create(
      dataConFecha,
      id_usuario,
    );
    return toNotificacionDTO(nuevaNotificacion);
  }

  async obtenerTodasLasNotificaciones() {
    const notificaciones = await this.notificacionRepository.findAll();
    return notificaciones.map(toNotificacionDTO);
  }

  async obtenerNotificacionesUsuario(id_usuario: number) {
    if (!id_usuario) {
      throw new Error("ID de usuario no válido");
    }
    const notificacionesPorUsuario =
      await this.notificacionRepository.findByUserId(id_usuario);

    return notificacionesPorUsuario.map(toNotificacionDTO);
  }

  async obtenerNotificacionesPendientesUsuario(id_usuario: number) {
    if (!id_usuario) {
      throw new Error("ID de usuario no válido");
    }
    const notificacionesPendientes =
      await this.notificacionRepository.findPendingByUserId(id_usuario);

    return notificacionesPendientes.map(toNotificacionDTO);
  }

  async obtenerNotificacionPorId(id_notificacion: number, id_usuario: number) {
    if (!id_notificacion) {
      throw new Error("ID de notificación no válido");
    }

    const notificacion =
      await this.notificacionRepository.findById(id_notificacion);
    if (!notificacion || notificacion.id_usuario !== id_usuario) {
      throw new Error("Notificación no encontrada");
    }
    return toNotificacionDTO(notificacion);
  }

  async actualizarNotificacion(
    id_notificacion: number,
    data: Partial<NotificacionDTO>,
    id_usuario: number,
  ) {
    if (!id_notificacion) {
      throw new Error("ID de notificación no válido");
    }

    const existente =
      await this.notificacionRepository.findById(id_notificacion);
    if (!existente) {
      throw new Error("Notificación no encontrada");
    }

    if (existente.id_usuario !== id_usuario) {
      throw new Error("No tienes permiso para actualizar esta notificación");
    }

    const dataConFecha: Partial<Notificacion> = {
      ...data,
      ...(data.fecha_vencimiento && {
        fecha_vencimiento: parseDate(data.fecha_vencimiento),
      }),
    };
    const notificacionActualizada = await this.notificacionRepository.update(
      id_notificacion,
      dataConFecha,
    );
    return toNotificacionDTO(notificacionActualizada);
  }

  async eliminarNotificacion(id_notificacion: number, id_usuario: number) {
    if (!id_notificacion) {
      throw new Error("ID de notificación no válido");
    }

    const existente =
      await this.notificacionRepository.findById(id_notificacion);
    if (!existente) {
      throw new Error("Notificación no encontrada");
    }

    if (existente.id_usuario !== id_usuario) {
      throw new Error("No tienes permiso para eliminar esta notificación");
    }

    return this.notificacionRepository.delete(id_notificacion);
  }

  async marcarNotificacionComoPagada(
    id_notificacion: number,
    id_usuario: number,
  ) {
    if (!id_notificacion) {
      throw new Error("ID de notificación no válido");
    }

    const existente =
      await this.notificacionRepository.findById(id_notificacion);

    if (!existente) {
      throw new Error("Notificación no encontrada");
    }
    if (existente.id_usuario !== id_usuario) {
      throw new Error("No tienes permiso para actualizar esta notificación");
    }

    const notificacionPagada =
      await this.notificacionRepository.markAsPaid(id_notificacion);
    return toNotificacionDTO(notificacionPagada);
  }
}
