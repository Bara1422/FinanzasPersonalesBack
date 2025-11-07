import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import type { NotificacionService } from "../services/notificacion.service";

export class NotificacionController {
  constructor(private notificacionService: NotificacionService) {}

  crearNotificacion = async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const data = { ...req.body, id_usuario: user.id_usuario };

      const nuevaNotificacion =
        await this.notificacionService.crearNotificacion(data, user.id_usuario);
      return res.status(201).json(nuevaNotificacion);
    } catch (error) {
      return res.status(500).json({
        message: "Error al crear notificación",
        error: error.message || error,
      });
    }
  };

  obtenerTodasLasNotificaciones = async (_req: AuthRequest, res: Response) => {
    try {
      const notificaciones =
        await this.notificacionService.obtenerTodasLasNotificaciones();
      return res.json(notificaciones);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener las notificaciones",
        error: error.message || error,
      });
    }
  };

  obtenerNotificacionesPorUsuario = async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const notificaciones =
        await this.notificacionService.obtenerNotificacionesUsuario(
          user.id_usuario,
        );
      return res.json(notificaciones);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener las notificaciones",
        error: error.message || error,
      });
    }
  };

  obtenerNotificacionesPendientesPorUsuario = async (
    req: AuthRequest,
    res: Response,
  ) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const notificaciones =
        await this.notificacionService.obtenerNotificacionesPendientesUsuario(
          user.id_usuario,
        );
      return res.json(notificaciones);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener las notificaciones",
        error: error.message || error,
      });
    }
  };

  obtenerNotificacionesPagadasPorUsuario = async (
    req: AuthRequest,
    res: Response,
  ) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const notificaciones =
        await this.notificacionService.obtenerNotificacionesPagadasUsuario(
          user.id_usuario,
        );
      return res.json(notificaciones);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener las notificaciones",
        error: error.message || error,
      });
    }
  };

  obtenerNotificacionPorId = async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const { id } = req.params;
      const notificacion =
        await this.notificacionService.obtenerNotificacionPorId(
          Number(id),
          user.id_usuario,
        );
      if (!notificacion) {
        return res.status(404).json({ message: "Notificación no encontrada" });
      }
      return res.json(notificacion);
    } catch (error) {
      return res.status(500).json({
        message: "Error al obtener la notificación",
        error: error.message || error,
      });
    }
  };

  actualizarNotificacion = async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;
      const { id } = req.params;

      if (!user || !user.id_usuario) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const data = req.body;

      const notificacionActualizada =
        await this.notificacionService.actualizarNotificacion(
          Number(id),
          data,
          user.id_usuario,
        );
      if (!notificacionActualizada) {
        return res.status(404).json({ message: "Notificación no encontrada" });
      }
      return res.json(notificacionActualizada);
    } catch (error) {
      return res.status(500).json({
        message: "Error al actualizar la notificación",
        error: error.message || error,
      });
    }
  };

  eliminarNotificacion = async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;
      const { id } = req.params;

      if (!user || !user.id_usuario) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      await this.notificacionService.eliminarNotificacion(
        Number(id),
        user.id_usuario,
      );
      return res
        .status(204)
        .json({ message: "Notificación eliminada correctamente" });
    } catch (error) {
      return res.status(500).json({
        message: "Error al eliminar la notificación",
        error: error.message || error,
      });
    }
  };

  marcarNotificacionComoPagada = async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;
      const { id } = req.params;

      if (!user || !user.id_usuario) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const notificacionActualizada =
        await this.notificacionService.marcarNotificacionComoPagada(
          Number(id),
          user.id_usuario,
        );
      if (!notificacionActualizada) {
        return res.status(404).json({ message: "Notificación no encontrada" });
      }
      return res.json(notificacionActualizada);
    } catch (error) {
      return res.status(500).json({
        message: "Error al marcar la notificación como pagada",
        error: error.message || error,
      });
    }
  };
}
