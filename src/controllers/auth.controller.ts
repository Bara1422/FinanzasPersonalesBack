import type { Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import type { AuthService } from "../services/auth.service";
import type { UserService } from "../services/usuario.service";

export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  register = async (req: Request, res: Response) => {
    try {
      const { nombre, ...rest } = req.body;
      const userData = { name: nombre, ...rest };
      const result = await this.authService.registerUsuario(userData);
      if (!result) {
        return res.status(400).json({ message: "Error al registrar usuario" });
      }
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        message: "Error al registrar usuarios",
        error: error.message || error,
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      if (!result) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      res.status(200).json(result);
    } catch (error) {
      if (error.message === "Credenciales inválidas") {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }
      res.status(500).json({
        message: "Error al iniciar sesión",
        error: error.message || error,
      });
    }
  };

  me = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user.id_usuario;
      const user = await this.userService.findById(userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener datos del usuario",
        error: error.message || error,
      });
    }
  };
}
