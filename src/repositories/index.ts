import { RepositoryFactory } from "./RepositoryFactory";

const repositories = RepositoryFactory.createAllRepositories();

export const { userRepository } = repositories;
