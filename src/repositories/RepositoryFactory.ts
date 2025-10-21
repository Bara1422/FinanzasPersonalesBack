import { BcryptAdapter } from "../config/bcrypt";

export class RepositoryFactory {
  private static instance: RepositoryFactory;
  private hasher: BcryptAdapter;

  private constructor() {
    this.hasher = new BcryptAdapter();
  }

  static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  createAllRepositories() {
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment) {
      const { UserRepositoryMock } = require("./mock/UserRepositoryMock");
      return {
        userRepository: new UserRepositoryMock(this.hasher),
      };
    } else {
      const { UserRepositoryPrisma } = require("./prisma/UserRepositoryPrisma");
      return {
        userRepository: new UserRepositoryPrisma(this.hasher),
      };
    }
  }
}
