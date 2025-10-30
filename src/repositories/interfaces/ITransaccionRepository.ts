import type { Transaccion } from "@prisma/client";
import type { ResumenFinanciero } from "../../types/transaction.types";

export interface ITransaccionRepository<T extends Transaccion> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  findByUserId(id_usuario: number): Promise<T[]>;
  create(data: Partial<T>, id_usuario: number): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<string>;
  getResumen(id_usuario: number): Promise<ResumenFinanciero>;
}
