import { BcryptAdapter } from "../config/bcrypt";

import {
  CategoryRepositoryMock,
  NotificacionRepositoryMock,
  TransaccionRepositoryMock,
  UserRepositoryMock,
} from "./mock";

import {
  CategoryRepositoryPrisma,
  NotificacionRepositoryPrisma,
  TransaccionRepositoryPrisma,
  UserRepositoryPrisma,
} from "./prisma";

export class RepositoryFactory {
  private static hasher = BcryptAdapter.getInstance();

  static createAllRepositories() {
    const useMock =
      process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

    if (useMock) {
      return RepositoryFactory.createMockRepositories();
    } else {
      return RepositoryFactory.createPrismaRepositories();
    }
  }

  private static createMockRepositories() {
    return {
      userRepository: new UserRepositoryMock(RepositoryFactory.hasher),
      transactionRepository: new TransaccionRepositoryMock(),
      categoryRepository: new CategoryRepositoryMock(),
      notificacionRepository: new NotificacionRepositoryMock(),
    };
  }

  private static createPrismaRepositories() {
    return {
      userRepository: new UserRepositoryPrisma(RepositoryFactory.hasher),
      transactionRepository: new TransaccionRepositoryPrisma(),
      categoryRepository: new CategoryRepositoryPrisma(),
      notificacionRepository: new NotificacionRepositoryPrisma(),
    };
  }
}
