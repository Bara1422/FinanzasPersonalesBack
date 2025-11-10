import type { Reporte, Transaccion } from "@prisma/client";
import { BcryptAdapter } from "../config/bcrypt";


import type { ITransaccionRepository } from "./interfaces/ITransaccionRepository";
import type { IReportRepository,IReportDataGenerator,} from "./interfaces/IReportDataGenerator";

// Repositorios MOCK
import { UserRepositoryMock } from "./mock/UserRepositoryMock";
import { TransaccionRepositoryMock } from "./mock/TransaccionRepositoryMock";
import { ReportRepositoryMock } from "./mock/ReportRepositoryMock";

//Repositorios PRISMA
import { UserRepositoryPrisma } from "./prisma/UserRepositoryPrisma";
import { TransaccionRepositoryPrisma } from "./prisma/TransaccionRepositoryPrisma";
import { ReportRepositoryPrisma } from "./prisma/ReportRepositoryPrisma";

export class RepositoryFactory {
  private static instance: RepositoryFactory | null = null;

  private userRepository: any;
  private transaccionRepository: ITransaccionRepository<Transaccion>;
  private reportRepository: IReportRepository<Reporte>;

  private constructor() {
    const useMock = process.env.NODE_ENV === "development";
    const hasher = new BcryptAdapter();

    if (useMock) {
      console.log("Usando repositorios MOCK");
      this.userRepository = new UserRepositoryMock(hasher);
      this.transaccionRepository = new TransaccionRepositoryMock();
      this.reportRepository = new ReportRepositoryMock();
    } else {
      console.log("Usando repositorios PRISMA");
      this.userRepository = new UserRepositoryPrisma(hasher);
      this.transaccionRepository = new TransaccionRepositoryPrisma();
      this.reportRepository = new ReportRepositoryPrisma();
    }
  }

  
   //Singleton: evita crear múltiples instancias

  public static getInstance(): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory();
    }
    return RepositoryFactory.instance;
  }

  /**
   * Repositorio de usuarios
   */
  public getUserRepository() {
    return this.userRepository;
  }

  /**
   * Repositorio de transacciones
   */
  public getTransaccionRepository(): ITransaccionRepository<Transaccion> {
    return this.transaccionRepository;
  }

  /**
   * Repositorio de reportes
   */
  public getReportRepository(): IReportRepository<Reporte> {
    return this.reportRepository;
  }

  /**
   * Método auxiliar (opcional) para crear todos los repositorios a la vez
   */
  public static createAllRepositories() {
    const instance = RepositoryFactory.getInstance();

    return {
      userRepository: instance.getUserRepository(),
      transaccionRepository: instance.getTransaccionRepository(),
      reportRepository: instance.getReportRepository(),
    };
  }
}
