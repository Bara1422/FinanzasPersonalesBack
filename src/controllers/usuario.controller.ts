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
      const id = Number(req.params.id);

      if (!id) {
        throw new CustomError("ID de usuario inválido", 400);
      }

      const user = await this.userService.findById(Number(id));

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);

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

      if (!id) {
        return res.status(400).json({ message: "ID de usuario inválido" });
      }

      const message = await this.userService.delete(id);
      return res.status(200).json({ message });
    } catch (error) {
      next(error);
    }
  };
}
