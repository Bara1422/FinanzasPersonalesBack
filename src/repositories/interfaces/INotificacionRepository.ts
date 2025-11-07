import type { Notificacion } from "@prisma/client";

export interface INotificacionRepository<T extends Notificacion> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  findByUserId(id_usuario: number): Promise<T[]>;
  findPendingByUserId(id_usuario: number): Promise<T[]>;
  findPaidByUserId(id_usuario: number): Promise<T[]>;
  create(data: Partial<T>, id_usuario: number): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<string>;
  markAsPaid(id: number): Promise<T>;
  
}