import { RepositoryFactory } from "./RepositoryFactory";

const repositories = RepositoryFactory.createAllRepositories();

export const {
  userRepository,
  transactionRepository,
  categoryRepository,
  notificacionRepository,
} = repositories;
