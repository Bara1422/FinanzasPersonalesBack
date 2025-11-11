import type { Request, Response } from "express";
import type { UserService } from "../services/usuario.service";

export class UserController {
  constructor(private userService: UserService) {}

  getAll = async (_req: Request, res: Response) => {
    try {
      const users = await this.userService.getAll();
      res.status(200).json(users);
    } catch {
      res.status(500).json({ message: "Error al obtener usuarios" });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const user = await this.userService.findById(Number(id));
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener usuario",
        error: error.message || error,
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data: Partial<{ name: string; email: string; username: string }> =
        req.body;
      const updatedUser = await this.userService.update(id, data);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({
        message: "Error al actualizar usuario",
        error: error.message || error,
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const message = await this.userService.delete(id);
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({
        message: "Error al eliminar usuario",
        error: error.message || error,
      });
    }
  };
}
