import type { Usuario } from "@prisma/client";
import type { BcryptAdapter } from "../../config/bcrypt";
import prisma from "../../db/prisma";
import type { IUserRepository } from "../interfaces/IUserRepository";

export class UserRepositoryPrisma implements IUserRepository<Usuario> {
  private hasher: BcryptAdapter;

  constructor(hasher: BcryptAdapter) {
    this.hasher = hasher;
  }

  async findAll(): Promise<Usuario[]> {
    return await prisma.usuario.findMany();
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({ where: { email } });
  }

  async findByUsername(username: string): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({ where: { username } });
  }

  async findById(id: number): Promise<Usuario | null> {
    return await prisma.usuario.findUnique({ where: { id_usuario: id } });
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    if (!data.email || !data.password || !data.name || !data.username) {
      throw new Error(
        "Faltan campos obligatorios (email, password, name, username)",
      );
    }

    const password_hash = data.password ? this.hasher.hash(data.password) : "";

    return await prisma.usuario.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        password: password_hash,
        rol: data.rol ?? "USER",
        activo: data.activo ?? true,
        created_at: data.created_at ?? new Date(),
        updated_at: data.updated_at ?? new Date(),
        reset_token: data.reset_token ?? null,
        reset_token_expires_at: data.reset_token_expires_at ?? null,
      },
    });
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const updateData: Partial<Usuario> = { ...data };

    return await prisma.usuario.update({
      where: { id_usuario: id },
      data: updateData,
    });
  }

  async delete(id: number): Promise<string> {
    await prisma.usuario.delete({ where: { id_usuario: id } });
    return "Usuario eliminado correctamente";
  }

  async findByResetToken(token: string): Promise<Usuario | null> {
    return await prisma.usuario.findFirst({
      where: { reset_token: token },
    });
  }

  async setResetToken(
    id: number,
    token: string | null,
    expiresAt: Date | null,
  ): Promise<Usuario> {
    return await prisma.usuario.update({
      where: { id_usuario: id },
      data: {
        reset_token: token,
        reset_token_expires_at: expiresAt,
        updated_at: new Date(),
      },
    });
  }

  async updatePassword(id: number, password: string): Promise<Usuario> {
    const password_hash = this.hasher.hash(password);

    return await prisma.usuario.update({
      where: { id_usuario: id },
      data: {
        password: password_hash,
        reset_token: null,
        reset_token_expires_at: null,
        updated_at: new Date(),
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
