import type { $Enums, Usuario } from "@prisma/client";
import type { BcryptAdapter } from "../../config/bcrypt";
import prisma from "../../db/prisma";
import type { IUserRepository } from "../interfaces/IUserRepository";

export class UserRepositoryPrisma implements IUserRepository<Usuario> {
  constructor(private hasher: BcryptAdapter) {}

  async findByEmail(email: string): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({ where: { email } });
  }
  async findByUsername(username: string): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({ where: { username } });
  }
  async findAll(): Promise<Usuario[]> {
    return await prisma.usuario.findMany();
  }
  async findById(id: number): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({ where: { id_usuario: id } });
  }
  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    return await prisma.usuario.update({
      where: { id_usuario: id },
      data,
    });
  }
  async delete(id: number): Promise<string> {
    await prisma.usuario.delete({ where: { id_usuario: id } });
    return "Usuario eliminado correctamente";
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const { name, email, username, password } = data;
    const password_hash = password ? this.hasher.hash(password) : "";
    return await prisma.usuario.create({
      data: {
        name,
        email,
        username,
        password: password_hash,
        rol: "USER" as $Enums.Rol,
        created_at: data.created_at,
        updated_at: data.updated_at,
        activo: true,
      },
    });
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<Usuario | null> {
    const usuario = await this.findByEmail(email);
    if (!usuario) return null;

    const isPasswordValid = this.hasher.compare(password, usuario.password);
    return isPasswordValid ? usuario : null;
  }
}
