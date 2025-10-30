import type { Usuario } from "@prisma/client";
import { toUsuarioDTO } from "../dtos/usuario.dto";
import { userRepository } from "../repositories";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";

export class UserService {
  constructor(private userRepository: IUserRepository<Usuario>) {}

  async getAll() {
    const users = await this.userRepository.findAll();
    return users.map(toUsuarioDTO);
  }

  async findById(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return toUsuarioDTO(user);
  }

  async update(
    id: number,
    data: Partial<{ name: string; email: string; username: string }>,
  ) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const updatedUser = await this.userRepository.update(id, data);
    return toUsuarioDTO(updatedUser);
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
