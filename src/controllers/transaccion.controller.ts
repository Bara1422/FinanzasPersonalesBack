import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";

import type { TransaccionService } from "../services/transaccion.service";
import { CustomError } from "../utils/CustomError";

export class TransaccionController {
  constructor(private transaccionService: TransaccionService) {}

  crearTransaccion = async (
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

      const nuevaTransaccion = await this.transaccionService.crearTransaccion(
        data,
        user.id_usuario,
      );
      return res.status(201).json(nuevaTransaccion);
    } catch (error) {
      next(error);
    }
  };

  obtenerTodasLasTransacciones = async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const transacciones =
        await this.transaccionService.obtenerTodasLasTransacciones();
      return res.json(transacciones);
    } catch (error) {
      next(error);
    }
  };

  obtenerTransaccionesPorUsuario = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      const transacciones =
        await this.transaccionService.obtenerTransaccionesUsuario(
          user.id_usuario,
        );
      return res.json(transacciones);
    } catch (error) {
      next(error);
    }
  };

  obtenerResumen = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      const resumen = await this.transaccionService.obtenerResumenFinanciero(
        user.id_usuario,
      );
      return res.json(resumen);
    } catch (error) {
      next(error);
    }
  };

  obtenerTransaccionPorId = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;
      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      const id_transaccion = Number(req.params.id);

      if (!id_transaccion) {
        throw new CustomError("ID de transacción no válido", 400);
      }

      const transaccion = await this.transaccionService.obtenerTransaccionPorId(
        id_transaccion,
        user.id_usuario,
      );

      return res.json(transaccion);
    } catch (error) {
      next(error);
    }
  };

  actualizarTransaccion = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;

      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      const id_transaccion = Number(req.params.id);

      if (!id_transaccion) {
        throw new CustomError("ID de transacción no válido", 400);
      }

      const data: Partial<{
        id_categoria: number;
        monto: number;
        descripcion: string;
      }> = req.body;

      const transaccionActualizada =
        await this.transaccionService.actualizarTransaccion(
          id_transaccion,
          data,
          user.id_usuario,
        );

      return res.json(transaccionActualizada);
    } catch (error) {
      next(error);
    }
  };

  eliminarTransaccion = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = req.user;

      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      const id_transaccion = Number(req.params.id);

      if (!id_transaccion) {
        throw new CustomError("ID de transacción no válido", 400);
      }

      const mensaje = await this.transaccionService.eliminarTransaccion(
        id_transaccion,
        user.id_usuario,
      );
      return res.json({ message: mensaje });
    } catch (error) {
      next(error);
    }
  };
}
