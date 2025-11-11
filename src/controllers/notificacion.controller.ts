import type { Notificacion } from "@prisma/client";
import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import type { NotificacionService } from "../services/notificacion.service";
import { CustomError } from "../utils/CustomError";

export class NotificacionController {
  constructor(private notificacionService: NotificacionService) {}

  crearNotificacion = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      const data = { ...req.body, id_usuario: user.id_usuario };
      if (
        !data.descripcion ||
        !data.monto ||
        !data.fecha_vencimiento ||
        !data.id_categoria
      ) {
        throw new CustomError(
          "Faltan datos requeridos para crear la notificación",
          400,
        );
      }

      const nuevaNotificacion =
        await this.notificacionService.crearNotificacion(data, user.id_usuario);
      return res.status(201).json(nuevaNotificacion);
    } catch (error) {
      next(error);
    }
  };

  obtenerTodasLasNotificaciones = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const notificaciones =
        await this.notificacionService.obtenerTodasLasNotificaciones();
      return res.json(notificaciones);
    } catch (error) {
      next(error);
    }
  };

  obtenerNotificacionesPorUsuario = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      const notificaciones =
        await this.notificacionService.obtenerNotificacionesUsuario(
          user.id_usuario,
        );
      return res.json(notificaciones);
    } catch (error) {
      next(error);
    }
  };

  obtenerNotificacionesPendientesPorUsuario = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      const notificaciones =
        await this.notificacionService.obtenerNotificacionesPendientesUsuario(
          user.id_usuario,
        );
      return res.json(notificaciones);
    } catch (error) {
      next(error);
    }
  };

  obtenerNotificacionesPagadasPorUsuario = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      const notificaciones =
        await this.notificacionService.obtenerNotificacionesPagadasUsuario(
          user.id_usuario,
        );
      return res.json(notificaciones);
    } catch (error) {
      next(error);
    }
  };

  obtenerNotificacionPorId = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      const id = Number(req.params.id);

      if (!id) {
        throw new CustomError("ID de notificación inválido", 400);
      }

      const notificacion =
        await this.notificacionService.obtenerNotificacionPorId(
          id,
          user.id_usuario,
        );

      return res.json(notificacion);
    } catch (error) {
      next(error);
    }
  };

  actualizarNotificacion = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }
      const id = Number(req.params.id);

      if (!id) {
        throw new CustomError("ID de notificación inválido", 400);
      }

      const data: Partial<Notificacion> = req.body;
      if (
        !data.descripcion &&
        !data.monto &&
        !data.fecha_vencimiento &&
        !data.id_categoria &&
        !data.pagado &&
        !data.prioridad
      ) {
        throw new CustomError(
          "No se proporcionaron datos para actualizar",
          400,
        );
      }

      const notificacionActualizada =
        await this.notificacionService.actualizarNotificacion(
          id,
          data,
          user.id_usuario,
        );

      return res.json(notificacionActualizada);
    } catch (error) {
      next(error);
    }
  };

  eliminarNotificacion = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;

      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      const id = Number(req.params.id);

      if (!id) {
        throw new CustomError("ID de notificación inválido", 400);
      }

      await this.notificacionService.eliminarNotificacion(id, user.id_usuario);
      return res
        .status(204)
        .json({ message: "Notificación eliminada correctamente" });
    } catch (error) {
      next(error);
    }
  };

  marcarNotificacionComoPagada = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;

      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }
      const id = Number(req.params.id);

      if (!id) {
        throw new CustomError("ID de notificación inválido", 400);
      }

      const notificacionActualizada =
        await this.notificacionService.marcarNotificacionComoPagada(
          id,
          user.id_usuario,
        );

      return res.json(notificacionActualizada);
    } catch (error) {
      next(error);
    }
  };
}
