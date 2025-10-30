import type { Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";

import type { TransaccionService } from "../services/transaccion.service";

export class TransaccionController {
  constructor(private transaccionService: TransaccionService) {}

  // Crea nueva transacción
  crearTransaccion = async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const data = { ...req.body, id_usuario: user.id_usuario };
      const nuevaTransaccion = await this.transaccionService.crearTransaccion(
        data,
        user.id_usuario,
      );
      return res.status(201).json(nuevaTransaccion);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener usuario",
        error: error.message || error,
      });
    }
  };

  // Obtiene todas las transacciones
  obtenerTodasLasTransacciones = async (_req: AuthRequest, res: Response) => {
    try {
      const transacciones =
        await this.transaccionService.obtenerTodasLasTransacciones();
      return res.json(transacciones);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener las transacciones",
        error: error.message || error,
      });
    }
  };

  // Obtiene transacciones del usuario autenticado
  obtenerTransaccionesPorUsuario = async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const transacciones =
        await this.transaccionService.obtenerTransaccionesUsuario(
          user.id_usuario,
        );
      return res.json(transacciones);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener las transacciones",
        error: error.message || error,
      });
    }
  };

  // Obtiene resumen financiero del usuario autenticado
  obtenerResumen = async (req: AuthRequest, res: Response) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const resumen = await this.transaccionService.obtenerResumenFinanciero(
        user.id_usuario,
      );
      return res.json(resumen);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener el resumen financiero",
        error: error.message || error,
      });
    }
  };

  // Obtiene transacción por ID
  obtenerTransaccionPorId = async (req: AuthRequest, res: Response) => {
    try {
      const id_transaccion = Number(req.params.id);
      const id_usuario = req.user.id_usuario;
      if (Number.isNaN(id_transaccion)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const transaccion = await this.transaccionService.obtenerTransaccionPorId(
        id_transaccion,
        id_usuario,
      );
      if (!transaccion) {
        return res.status(404).json({ message: "Transacción no encontrada" });
      }

      return res.json(transaccion);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener la transacción",
        error: error.message || error,
      });
    }
  };

  // Actualiza transacción existente
  actualizarTransaccion = async (req: AuthRequest, res: Response) => {
    try {
      const id_transaccion = Number(req.params.id);
      const id_usuario = req.user.id_usuario;

      if (Number.isNaN(id_transaccion)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const data: Partial<{ id_categoria: number; monto: number; descripcion: string }> = req.body;
      const transaccionActualizada =
        await this.transaccionService.actualizarTransaccion(
          id_transaccion,
          data,
          id_usuario,
        );
      if (!transaccionActualizada) {
        return res.status(404).json({ message: "Transacción no encontrada" });
      }

      return res.json(transaccionActualizada);
    } catch (error) {
      res.status(500).json({
        message: "Error al actualizar la transacción",
        error: error.message || error,
      });
    }
  };

  // Elimina una transacción
  eliminarTransaccion = async (req: AuthRequest, res: Response) => {
    try {
      const id_transaccion = Number(req.params.id);
      const id_usuario = req.user.id_usuario;
      if (Number.isNaN(id_transaccion)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const mensaje = await this.transaccionService.eliminarTransaccion(
        id_transaccion,
        id_usuario,
      );
      return res.json({ message: mensaje });
    } catch (error) {
      res.status(500).json({
        message: "Error al eliminar la transacción",
        error: error.message || error,
      });
    }
  };
}
