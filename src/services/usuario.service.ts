import type { Usuario } from "@prisma/client";
import { toUsuarioDTO } from "../dtos/usuario.dto";
import { userRepository } from "../repositories";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { CustomError } from "../utils/CustomError";

export class UserService {
  constructor(private userRepository: IUserRepository<Usuario>) {}

  async getAll() {
    const users = await this.userRepository.findAll();
    return users.map(toUsuarioDTO);
  }

  async findById(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new CustomError("Usuario no encontrado", 404);
    }
    return toUsuarioDTO(user);
  }

  async update(
    id: number,
    data: Partial<{ name: string; email: string; username: string }>,
  ) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new CustomError("Usuario no encontrado", 404);
    }
    const updatedUser = await this.userRepository.update(id, data);
    return toUsuarioDTO(updatedUser);
  }

  async delete(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new CustomError("Usuario no encontrado", 404);
    }
    await userRepository.delete(id);
    return "Usuario eliminado correctamente";
  }
}
