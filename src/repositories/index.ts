import { RepositoryFactory } from "./RepositoryFactory";

export const userRepository = RepositoryFactory.getUserRepository();
export const transaccionRepository = RepositoryFactory.getTransaccionRepository();
export const reportRepository = RepositoryFactory.getReportRepository();
