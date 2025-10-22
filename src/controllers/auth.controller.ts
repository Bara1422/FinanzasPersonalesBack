import type { Request, Response } from "express";
import type { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const result = await this.authService.registerUsuario(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({
        message: "Error al registrar usuarioas",
        error: error.message || error,
      });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        message: "Error al iniciar sesión",
        error: error.message || error,
      });
    }
  };

  me = async (req: Request, res: Response) => {
    try {
      res.json((req as any).user);
    } catch {
      res.status(401).json({ message: "Token no válido" });
    }
  };
}
