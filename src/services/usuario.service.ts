import type { Usuario } from "@prisma/client";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { RepositoryFactory } from "../repositories/RepositoryFactory";

const { userRepository }: { userRepository: IUserRepository<Usuario> } =
  RepositoryFactory.getInstance().createAllRepositories();

export class UserService {
  async getAll() {
    return await userRepository.findAll();
  }

  async findById(id: number) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user;
  }

  async update(
    id: number,
    data: Partial<{ name: string; email: string; username: string }>,
  ) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return await userRepository.update(id, data);
  }

  async delete(id: number) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    await userRepository.delete(id);
    return "Usuario eliminado correctamente";
  }
}
