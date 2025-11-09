import { BcryptAdapter } from "../config/bcrypt";

export class RepositoryFactory {
  private static hasher = new BcryptAdapter();
  static createAllRepositories() {
    const useMock = process.env.NODE_ENV === "development";

    if (useMock) {
      return RepositoryFactory.createMockRepositories();
    } else {
      return RepositoryFactory.createPrismaRepositories();
    }
  }

  private static createMockRepositories() {
    const {
      UserRepositoryMock,
      TransaccionRepositoryMock,
      NotificacionRepositoryMock,
      CategoryRepositoryMock,
    } = require("./mock");

    return {
      userRepository: new UserRepositoryMock(RepositoryFactory.hasher),
      transactionRepository: new TransaccionRepositoryMock(),
      categoryRepository: new CategoryRepositoryMock(),
      notificacionRepository: new NotificacionRepositoryMock(),
    };
  }

  private static createPrismaRepositories() {
    const {
      UserRepositoryPrisma,
      TransaccionRepositoryPrisma,
      NotificacionRepositoryPrisma,
      CategoryRepositoryPrisma,
    } = require("./prisma");

    return {
      userRepository: new UserRepositoryPrisma(RepositoryFactory.hasher),
      transactionRepository: new TransaccionRepositoryPrisma(),
      categoryRepository: new CategoryRepositoryPrisma(),
      notificacionRepository: new NotificacionRepositoryPrisma(),
    };
  }
}
