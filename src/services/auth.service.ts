import type { Usuario } from "@prisma/client";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { mailerEnabled, sendMail } from "../config/mailer";
import { toUsuarioDTO } from "../dtos/usuario.dto";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { CustomError } from "../utils/CustomError";

export class AuthService {
  private resetTokenTTLMinutes = 30;

  constructor(private userRepository: IUserRepository<Usuario>) {}

  async registerUsuario(data: {
    name: string;
    email: string;
    username: string;
    password: string;
  }) {
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) throw new CustomError("El correo ya está en uso", 400);

    const existingUsername = await this.userRepository.findByUsername(
      data.username,
    );
    if (existingUsername)
      throw new CustomError("El nombre de usuario ya está en uso", 400);

    const createdUser = await this.userRepository.create(data);
    if (!createdUser) throw new CustomError("Error al crear el usuario", 500);

    const token = jwt.sign(
      {
        id_usuario: createdUser.id_usuario,
        rol: createdUser.rol,
      },
      ENV.JWT_SECRET,
      { expiresIn: "1d" },
    );
    const userDTO = toUsuarioDTO(createdUser);
    return { usuario: userDTO, token };
  }

  async login(email: string, password: string) {
    const validatedUser = await this.userRepository.validateCredentials(
      email,
      password,
    );
    if (!validatedUser) throw new CustomError("Credenciales inválidas", 401);

    const token = jwt.sign(
      {
        id_usuario: validatedUser.id_usuario,
        rol: validatedUser.rol,
      },
      ENV.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const userDTO = toUsuarioDTO(validatedUser);
    return { usuario: userDTO, token };
  }

  async sendResetToken(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return {
        message:
          "Si el correo está registrado, enviamos un enlace para restablecer la contraseña",
      };
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = this.hashToken(rawToken);
    const expiresAt = new Date(
      Date.now() + this.resetTokenTTLMinutes * 60 * 1000,
    );

    await this.userRepository.setResetToken(
      user.id_usuario,
      hashedToken,
      expiresAt,
    );

    if (mailerEnabled) {
      const resetUrl = `${ENV.FRONTEND_URL ?? "http://localhost:5173"}/reset-password?token=${rawToken}`;
      try {
        await sendMail({
          to: user.email,
          subject: "Recuperación de contraseña",
          text: `Recibimos una solicitud para restablecer tu contraseña. Usa este enlace para continuar: ${resetUrl}`,
          html: `<p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente enlace o pégalo en tu navegador:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>Si no solicitaste esto, puedes ignorar este correo.</p>`,
        });
      } catch (error) {
        console.warn("No se pudo enviar el email de recuperación:", error);
      }
    }

    return mailerEnabled
      ? {
          message:
            "Token de recuperación generado. Revisa tu correo para continuar.",
        }
      : {
          message:
            "Token de recuperación generado. Revisa tu correo para continuar.",
          token: rawToken,
          expiresAt,
        };
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = this.hashToken(token);
    const user = await this.userRepository.findByResetToken(hashedToken);

    if (
      !user ||
      !user.reset_token_expires_at ||
      user.reset_token_expires_at < new Date()
    ) {
      throw new CustomError("Token inválido o expirado", 400);
    }

    await this.userRepository.updatePassword(user.id_usuario, newPassword);

    return { message: "Contraseña actualizada correctamente" };
  }

  async verifyToken(token: string) {
    try {
      return jwt.verify(token, ENV.JWT_SECRET);
    } catch {
      throw new CustomError("Token inválido", 401);
    }
  }

  private hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
}
