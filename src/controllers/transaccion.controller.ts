import { Request, Response } from "express";
import { TransaccionRepositoryPrisma } from "../repositories/prisma/TransaccionRepositoryPrisma";

const transaccionRepository = new TransaccionRepositoryPrisma();

export class TransaccionController {
  // Crea nueva transacción
  static async crearTransaccion(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const data = { ...req.body, id_usuario: user.id };
      const nuevaTransaccion = await transaccionRepository.create(data);
      return res.status(201).json(nuevaTransaccion);
    } catch (error: any) {
      console.error("Error al crear transacción:", error);
      return res.status(500).json({
        message: "Error al crear la transacción",
        error: error.message,
      });
    }
  }

  // Obtiene transacciones del usuario autenticado
  static async obtenerTransacciones(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const transacciones = await transaccionRepository.findByUserId(user.id);
      return res.json(transacciones);
    } catch (error: any) {
      console.error("Error al obtener transacciones:", error);
      return res.status(500).json({
        message: "Error al obtener las transacciones",
        error: error.message,
      });
    }
  }

  // Obtiene resumen financiero del usuario autenticado
  static async obtenerResumen(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (!user || !user.id) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const resumen = await transaccionRepository.getResumen(user.id);
      return res.json(resumen);
    } catch (error: any) {
      console.error("Error al obtener resumen:", error);
      return res.status(500).json({
        message: "Error al obtener el resumen financiero",
        error: error.message,
      });
    }
  }

  // Obtiene transacción por ID
  static async obtenerTransaccionPorId(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const transaccion = await transaccionRepository.findById(id);
      if (!transaccion) {
        return res.status(404).json({ message: "Transacción no encontrada" });
      }

      return res.json(transaccion);
    } catch (error: any) {
      console.error("Error al obtener transacción:", error);
      return res.status(500).json({
        message: "Error al obtener la transacción",
        error: error.message,
      });
    }
  }

  // Actualiza transacción existente
  static async actualizarTransaccion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const data = req.body;
      const transaccionActualizada = await transaccionRepository.update(id, data);

      if (!transaccionActualizada) {
        return res.status(404).json({ message: "Transacción no encontrada" });
      }

      return res.json(transaccionActualizada);
    } catch (error: any) {
      console.error("Error al actualizar transacción:", error);
      return res.status(500).json({
        message: "Error al actualizar la transacción",
        error: error.message,
      });
    }
  }

  // Elimina una transacción
  static async eliminarTransaccion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      const mensaje = await transaccionRepository.delete(id);
      return res.json({ message: mensaje });
    } catch (error: any) {
      console.error("Error al eliminar transacción:", error);
      return res.status(500).json({
        message: "Error al eliminar la transacción",
        error: error.message,
      });
    }
  }
}
