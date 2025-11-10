// src/repositories/prisma/UserRepositoryPrisma.ts
import type { Usuario } from "@prisma/client";
import prisma from "../../db/prisma";
import type { BcryptAdapter } from "../../config/bcrypt";
import type { IUserRepository } from "../interfaces/IUserRepository";

/**
 * Implementación Prisma del repositorio de usuarios.
 * Recibe una instancia de BcryptAdapter para hashear/compare passwords.
 */
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
      throw new Error("Faltan campos obligatorios (email, password, name, username)");
    }

    // soporta hasher síncrono o asíncrono
    const passwordHash =
      typeof this.hasher.hash === "function"
        ? await this.hasher.hash(data.password as string)
        : (data.password as string);

    return await prisma.usuario.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        password: passwordHash,
        rol: (data.rol as any) ?? "USER",
        activo: data.activo ?? true,
        created_at: data.created_at ?? new Date(),
        updated_at: data.updated_at ?? new Date(),
      },
    });
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    // Si actualizan password, lo hasheamos
    const updateData: Partial<Usuario> = { ...data };
    if (data.password) {
      updateData.password = await this.hasher.hash(data.password);
    }

    return await prisma.usuario.update({
      where: { id_usuario: id },
      data: updateData as any,
    });
  }

  async delete(id: number): Promise<string> {
    await prisma.usuario.delete({ where: { id_usuario: id } });
    return "Usuario eliminado correctamente";
  }

  /**
   * Valida credenciales: busca usuario por email y compara password.
   * Devuelve el usuario si es válido, o null si no.
   */
  async validateCredentials(email: string, password: string): Promise<Usuario | null> {
    const usuario = await this.findByEmail(email);
    if (!usuario) return null;

    const isValid =
      typeof this.hasher.compare === "function"
        ? await this.hasher.compare(password, usuario.password)
        : password === usuario.password;

    return isValid ? usuario : null;
  }
}
