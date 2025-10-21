/* import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

 import {
  addUsuario,
  findUsuarioByEmail,
  findUsuarioById,
  findUsuarioByUsername,
  type Usuario,
} from "../models/user.model"; 




const SALT_ROUNDS = 10;

// Hasheamos la contraseña del usuario
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};
// Comparamos la contraseña ingresada con el hash almacenado
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
// Registramos un nuevo usuario
export const registerUsuario = async (data: {
  name: string;
  email: string;
  username: string;
  password: string;
  rol?: string;
}) => {
  const existingEmail = await userRepository.findUsuarioByEmail(data.email);
  if (existingEmail) throw new Error("UserExistsEmail");
  const existingUsername = await userRepository.findUsuarioByUsername(data.username);
  if (existingUsername) throw new Error("UserExistsUsername");
  const password_hash = await hashPassword(data.password);
  return userRepository.({
    name: data.name,
    email: data.email,
    username: data.username,
    password_hash,
    rol: data.rol || "user",
  }) as Promise<Usuario>;
};
// Generamos un token JWT para el usuario
export const generateToken = (usuario: Usuario): string => {
  const payload = {
    id_usuario: usuario.id_usuario,
    email: usuario.email,
    username: usuario.username,
    rol: usuario.rol,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};
// Verificamos y decodificamos el token JWT
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};

// re-export for controller convenience (async)
export const findUsuarioByEmailOrUsername = async (identifier: string) => {
  // Permite login por email o username
  const byEmail = await findUsuarioByEmail(identifier);
  if (byEmail) return byEmail;
  return findUsuarioByUsername(identifier);
};

export const findUsuarioByIdAsync = async (id_usuario: number) => {
  return findUsuarioById(id_usuario);
};

 */

import type { Usuario } from "@prisma/client";
import jwt from "jsonwebtoken";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { RepositoryFactory } from "../repositories/RepositoryFactory";

const { userRepository }: { userRepository: IUserRepository<Usuario> } =
  RepositoryFactory.getInstance().createAllRepositories();

const JWT_SECRET = process.env.JWT_SECRET;

export class AuthService {
  async registerUsuario(data: {
    name: string;
    email: string;
    username: string;
    password: string;
  }) {
    const existingEmail = await userRepository.findByEmail(data.email);
    if (existingEmail) throw new Error("El correo ya está en uso");

    const existingUsername = await userRepository.findByUsername(data.username);
    if (existingUsername)
      throw new Error("El nombre de usuario ya está en uso");

    const usuarioCreado = await userRepository.create(data);

    const token = jwt.sign(
      {
        id_usuario: usuarioCreado.id_usuario,
        email: usuarioCreado.email,
        username: usuarioCreado.username,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    );
    return { usuario: usuarioCreado, token };
  }

  async login(email: string, password: string) {
    const userValidado = await userRepository.validateCredentials(
      email,
      password,
    );
    if (!userValidado) throw new Error("Credenciales inválidas");

    const token = jwt.sign(
      {
        id_usuario: userValidado.id_usuario,
        email: userValidado.email,
        username: userValidado.username,
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
