import { BcryptAdapter } from "../config/bcrypt";

export class RepositoryFactory {
  static createAllRepositories() {
    const useMock = process.env.NODE_ENV === "development";
    const hasher = new BcryptAdapter();

    if (useMock) {
      const { UserRepositoryMock } = require("./mock/UserRepositoryMock");
      const {TransaccionRepositoryMock} = require("./mock/TransaccionRepositoryMock");
      return {
        userRepository: new UserRepositoryMock(hasher),
        transactionRepository: new TransaccionRepositoryMock()
      };
    } else {
      const { UserRepositoryPrisma } = require("./prisma/UserRepositoryPrisma");
      const {TransaccionRepositoryPrisma} = require("./prisma/TransaccionRepositoryPrisma");
      return {
        userRepository: new UserRepositoryPrisma(hasher),
        transactionRepository: new TransaccionRepositoryPrisma()
      };
    }
  }
}
