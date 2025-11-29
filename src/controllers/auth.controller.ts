import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middlewares/auth.middleware";
import type { AuthService } from "../services/auth.service";
import type { UserService } from "../services/usuario.service";
import { CustomError } from "../utils/CustomError";

export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { nombre, ...rest } = req.body;
      const userData = { name: nombre, ...rest };

      const result = await this.authService.registerUsuario(userData);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new CustomError("Faltan credenciales", 400);
      }

      const result = await this.authService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const result = await this.authService.sendResetToken(email);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, password } = req.body;
      const result = await this.authService.resetPassword(token, password);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id_usuario;
      if (!userId) {
        throw new CustomError("Usuario no autenticado", 401);
      }

      const user = await this.userService.findById(userId);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}
