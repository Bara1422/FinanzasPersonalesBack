import type { Usuario } from "@prisma/client";
import jwt from "jsonwebtoken";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";

const JWT_SECRET = process.env.JWT_SECRET;

export class AuthService {
  constructor(private userRepository: IUserRepository<Usuario>) {}

  async registerUsuario(data: {
    name: string;
    email: string;
    username: string;
    password: string;
  }) {
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) throw new Error("El correo ya está en uso");

    const existingUsername = await this.userRepository.findByUsername(
      data.username,
    );
    if (existingUsername)
      throw new Error("El nombre de usuario ya está en uso");

    const usuarioCreado = await this.userRepository.create(data);

    const token = jwt.sign(
      {
        id_usuario: usuarioCreado.id_usuario,
        email: usuarioCreado.email,
        username: usuarioCreado.username,
        rol: usuarioCreado.rol,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );
    return { usuario: usuarioCreado, token };
  }

  async login(email: string, password: string) {
    const userValidado = await this.userRepository.validateCredentials(
      email,
      password,
    );
    if (!userValidado) throw new Error("Credenciales inválidas");

    const token = jwt.sign(
      {
        id_usuario: userValidado.id_usuario,
        email: userValidado.email,
        username: userValidado.username,
        rol: userValidado.rol,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    return { usuario: userValidado, token };
  }

  async verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      throw new Error("Token inválido");
    }
  }
}
