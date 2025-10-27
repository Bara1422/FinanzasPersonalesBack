import type { Transaccion, TipoTransaccion } from "@prisma/client";
import type { ITransaccionRepository } from "../interfaces/ITransaccionRepository";

export class TransaccionRepositoryMock implements ITransaccionRepository<Transaccion> {
  private transaccionesDB: Transaccion[] = [
    {
      id_transaccion: 1,
      id_usuario: 1,
      id_categoria: 1,
      tipo: "INGRESO" as TipoTransaccion,
      monto: 100.5,
      fecha: new Date(),
      fecha_vencimiento: new Date(),
      descripcion: "Depósito inicial",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  async findAll(): Promise<Transaccion[]> {
    return Promise.resolve(this.transaccionesDB);
  }

  async findById(id: number): Promise<Transaccion | null> {
    const transaccion = this.transaccionesDB.find(t => t.id_transaccion === id);
    return Promise.resolve(transaccion || null);
  }

  async findByUserId(id_usuario: number): Promise<Transaccion[]> {
    const transacciones = this.transaccionesDB.filter(
      t => t.id_usuario === id_usuario
    );
    return Promise.resolve(transacciones);
  }

  async create(data: Partial<Transaccion>): Promise<Transaccion> {
    const newTransaccion: Transaccion = {
      id_transaccion: this.transaccionesDB.length + 1,
      id_usuario: data.id_usuario!,
      id_categoria: data.id_categoria ?? 1,
      tipo: data.tipo ?? "GASTO",
      monto: data.monto ?? 0,
      fecha: data.fecha ?? new Date(),
      fecha_vencimiento: data.fecha_vencimiento ?? null,
      descripcion: data.descripcion ?? null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.transaccionesDB.push(newTransaccion);
    return Promise.resolve(newTransaccion);
  }

  async update(id: number, data: Partial<Transaccion>): Promise<Transaccion> {
    const index = this.transaccionesDB.findIndex(t => t.id_transaccion === id);
    if (index === -1) throw new Error("Transacción no encontrada");
    this.transaccionesDB[index] = { ...this.transaccionesDB[index], ...data };
    return Promise.resolve(this.transaccionesDB[index]);
  }

  async delete(id: number): Promise<string> {
    this.transaccionesDB = this.transaccionesDB.filter(
      t => t.id_transaccion !== id
    );
    return Promise.resolve("Transacción eliminada correctamente");
  }

  
  async getResumen(id_usuario: number): Promise<any> {
    const transaccionesUsuario = this.transaccionesDB.filter(
      t => t.id_usuario === id_usuario
    );

    const total = transaccionesUsuario.length;
    const totalMonto = transaccionesUsuario.reduce(
      (acc, t) => acc + t.monto,
      0
    );

    return Promise.resolve({
      totalTransacciones: total,
      montoTotal: totalMonto,
    });
  }
}
