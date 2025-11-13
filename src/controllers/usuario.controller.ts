import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import type { UserService } from "../services/usuario.service";
import { CustomError } from "../utils/CustomError";

export class UserController {
  constructor(private userService: UserService) {}

  getAll = async (_req: AuthRequest, res: Response) => {
    try {
      const users = await this.userService.getAll();
      return res.status(200).json(users);
    } catch {
      return res.status(500).json({ message: "Error al obtener usuarios" });
    }
  };

  getById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }
      const id = Number(req.params.id);

      if (!id) {
        throw new CustomError("ID de usuario inválido", 400);
      }

      if (user.id_usuario !== id && user.rol !== "ADMIN") {
        throw new CustomError("No autorizado para ver este usuario", 403);
      }

      const userFound = await this.userService.findById(Number(id));

      return res.status(200).json(userFound);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = req.user;

      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      if (user.id_usuario !== id && user.rol !== "ADMIN") {
        throw new CustomError(
          "No autorizado para actualizar este usuario",
          403,
        );
      }
      if (!id) {
        throw new CustomError("ID de usuario inválido", 400);
      }

      const data: Partial<{ name: string; email: string; username: string }> =
        req.body;

      const updatedUser = await this.userService.update(id, data);
      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const user = req.user;

      if (!id) {
        return res.status(400).json({ message: "ID de usuario inválido" });
      }

      if (!user || !user.id_usuario) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      if (user.id_usuario !== id && user.rol !== "ADMIN") {
        throw new CustomError("No autorizado para eliminar este usuario", 403);
      }

      const message = await this.userService.delete(id);
      return res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  };
}
