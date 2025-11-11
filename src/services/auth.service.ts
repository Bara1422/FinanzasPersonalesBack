import type { Usuario } from "@prisma/client";
import jwt from "jsonwebtoken";
import { toUsuarioDTO } from "../dtos/usuario.dto";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { CustomError } from "../utils/CustomError";

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
    if (existingEmail) throw new CustomError("El correo ya está en uso", 400);

    const existingUsername = await this.userRepository.findByUsername(
      data.username,
    );
    if (existingUsername)
      throw new CustomError("El nombre de usuario ya está en uso", 400);

    const createdUser = await this.userRepository.create(data);

    const token = jwt.sign(
      {
        id_usuario: createdUser.id_usuario,
        rol: createdUser.rol,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
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
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    const userDTO = toUsuarioDTO(validatedUser);
    return { usuario: userDTO, token };
  }

  async verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      throw new Error("Token inválido");
    }
  }
}
