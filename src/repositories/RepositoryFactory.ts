import { BcryptAdapter } from "../config/bcrypt";

export class RepositoryFactory {
  static createAllRepositories() {
    const useMock = process.env.NODE_ENV === "development";
    const hasher = new BcryptAdapter();

    if (useMock) {
      const { UserRepositoryMock } = require("./mock/UserRepositoryMock");
      return {
        userRepository: new UserRepositoryMock(hasher),
      };
    } else {
      const { UserRepositoryPrisma } = require("./prisma/UserRepositoryPrisma");
      return {
        userRepository: new UserRepositoryPrisma(hasher),
      };
    }
  }
}
