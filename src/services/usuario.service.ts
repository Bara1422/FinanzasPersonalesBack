import type { Usuario } from "@prisma/client";
import { userRepository } from "../repositories";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";

export class UserService {
  constructor(private userRepository: IUserRepository<Usuario>) {}

  async getAll() {
    return await this.userRepository.findAll();
  }

  async findById(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  }

  async update(
    id: number,
    data: Partial<{ name: string; email: string; username: string }>,
  ) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return await this.userRepository.update(id, data);
  }

  async delete(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    await userRepository.delete(id);
    return "Usuario eliminado correctamente";
  }
}
