import type { $Enums, Usuario } from "@prisma/client";
import type { BcryptAdapter } from "../../config/bcrypt";
import type { IUserRepository } from "../interfaces/IUserRepository";

let usuariosDB: Usuario[] = [];

export class UserRepositoryMock implements IUserRepository<Usuario> {
  constructor(private hasher: BcryptAdapter) {}

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = usuariosDB.find((user) => user.email === email);
    return Promise.resolve(usuario || null);
  }
  async findByUsername(username: string): Promise<Usuario | null> {
    const usuario = usuariosDB.find((user) => user.username === username);
    return Promise.resolve(usuario || null);
  }

  async findAll(): Promise<Usuario[]> {
    return Promise.resolve(usuariosDB);
  }

  async findById(id: number): Promise<Usuario | null> {
    const usuario = usuariosDB.find((user) => user.id_usuario === id);
    return Promise.resolve(usuario || null);
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario | null> {
    const index = usuariosDB.findIndex((user) => user.id_usuario === id);
    if (index === -1) return Promise.resolve(null);
    usuariosDB[index] = { ...usuariosDB[index], ...data };
    return Promise.resolve(usuariosDB[index]);
  }

  async delete(id: number): Promise<string> {
    const filtered = usuariosDB.filter((user) => user.id_usuario !== id);
    usuariosDB = filtered;
    return Promise.resolve("Usuario eliminado correctamente");
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const { name, email, username } = data;
    const password_hash = data.password ? this.hasher.hash(data.password) : "";

    const newUsuario: Usuario = {
      id_usuario: usuariosDB.length + 1,
      name,
      email,
      username,
      password: password_hash,
      rol: "USER" as $Enums.Rol,
      created_at: data.created_at || new Date(),
      updated_at: data.updated_at || new Date(),
      activo: true,
    };
    usuariosDB.push(newUsuario);
    return Promise.resolve(newUsuario);
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<Usuario | null> {
    const usuario = usuariosDB.find((user) => user.email === email);
    if (!usuario) return Promise.resolve(null);

    const isPasswordValid = this.hasher.compare(password, usuario.password);
    return Promise.resolve(isPasswordValid ? usuario : null);
  }
}
