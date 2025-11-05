import type { $Enums, Usuario } from "@prisma/client";
import type { BcryptAdapter } from "../../config/bcrypt";
import type { IUserRepository } from "../interfaces/IUserRepository";

// hashear una contraseña "1234" con bcrypt
// para tener una contraseña válida en el mock

export class UserRepositoryMock implements IUserRepository<Usuario> {
  private usuariosDB: Usuario[] = [];
  constructor(private hasher: BcryptAdapter) {
    this.usuariosDB = [
      {
        id_usuario: 1,
        name: "Admin",
        email: "admin@example.com",
        username: "admin",
        password: this.hasher.hash("123456"),
        rol: "ADMIN" as $Enums.Rol,
        created_at: new Date(),
        updated_at: new Date(),
        activo: true,
      },
      {
        id_usuario: 2,
        name: "User",
        email: "user@example.com",
        username: "user",
        password: this.hasher.hash("123456"),
        rol: "USER" as $Enums.Rol,
        created_at: new Date(),
        updated_at: new Date(),
        activo: true,
      },
    ];
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    const usuario = this.usuariosDB.find((user) => user.email === email);
    return Promise.resolve(usuario || null);
  }
  async findByUsername(username: string): Promise<Usuario | null> {
    const usuario = this.usuariosDB.find((user) => user.username === username);
    return Promise.resolve(usuario || null);
  }

  async findAll(): Promise<Usuario[]> {
    return Promise.resolve(this.usuariosDB);
  }

  async findById(id: number): Promise<Usuario | null> {
    const usuario = this.usuariosDB.find((user) => user.id_usuario === id);
    return Promise.resolve(usuario || null);
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario | null> {
    const index = this.usuariosDB.findIndex((user) => user.id_usuario === id);
    if (index === -1) return Promise.resolve(null);
    this.usuariosDB[index] = { ...this.usuariosDB[index], ...data };
    return Promise.resolve(this.usuariosDB[index]);
  }

  async delete(id: number): Promise<string> {
    const filtered = this.usuariosDB.filter((user) => user.id_usuario !== id);
    this.usuariosDB = filtered;
    return Promise.resolve("Usuario eliminado correctamente");
  }

  async create(data: Partial<Usuario>): Promise<Usuario> {
    const { name, email, username } = data;
    const password_hash = data.password ? this.hasher.hash(data.password) : "";

    const newUsuario: Usuario = {
      id_usuario: this.usuariosDB.length + 1,
      name,
      email,
      username,
      password: password_hash,
      rol: "USER" as $Enums.Rol,
      created_at: data.created_at || new Date(),
      updated_at: data.updated_at || new Date(),
      activo: true,
    };
    
    this.usuariosDB.push(newUsuario);
    return Promise.resolve(newUsuario);
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<Usuario | null> {
    const usuario = this.usuariosDB.find((user) => user.email === email);
    if (!usuario) return Promise.resolve(null);

    const isPasswordValid = this.hasher.compare(password, usuario.password);
    return Promise.resolve(isPasswordValid ? usuario : null);
  }
}
