import type { Transaccion } from "@prisma/client";
import {
  type TransaccionDTO,
  toTransaccionDTO,
} from "../../dtos/transaccion.dto";
import type { ResumenFinanciero } from "../../types/transaction.types";
import type { ITransaccionRepository } from "../interfaces/ITransaccionRepository";

export class TransaccionRepositoryMock
  implements ITransaccionRepository<Transaccion>
{
  private transaccionesDB: Transaccion[] = [
    {
      id_transaccion: 1,
      id_usuario: 1,
      id_categoria: 1,
      monto: 100.5,
      descripcion: "Depósito inicial",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id_transaccion: 2,
      id_usuario: 1,
      id_categoria: 3,
      monto: 50.0,
      descripcion: "Compra de alimentos",
      created_at: new Date("2024-06-15"),
      updated_at: new Date(),
    },
  ];

  // simulacion hasta tener categorias
  private categoriasDB = [
    { id_categoria: 1, nombre: "Salario", tipo: "INGRESO" },
    { id_categoria: 2, nombre: "Freelance", tipo: "INGRESO" },
    { id_categoria: 3, nombre: "Comida", tipo: "GASTO" },
    { id_categoria: 4, nombre: "Transporte", tipo: "GASTO" },
    { id_categoria: 5, nombre: "Entretenimiento", tipo: "GASTO" },
  ];

  async findAll(): Promise<Transaccion[]> {
    return Promise.resolve(this.transaccionesDB);
  }

  async findById(id: number): Promise<Transaccion | null> {
    const transaccion = this.transaccionesDB.find(
      (t) => t.id_transaccion === id,
    );
    return Promise.resolve(transaccion || null);
  }

  async findByUserId(id_usuario: number): Promise<Transaccion[]> {
    const transacciones = this.transaccionesDB.filter(
      (t) => t.id_usuario === id_usuario,
    );
    return Promise.resolve(transacciones);
  }

  async create(
    data: Partial<Transaccion>,
    id_usuario: number,
  ): Promise<Transaccion> {
    const newTransaccion: Transaccion = {
      id_transaccion: this.transaccionesDB.length + 1,
      id_usuario: id_usuario,
      id_categoria: data.id_categoria,
      monto: data.monto,
      descripcion: data.descripcion,
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.transaccionesDB.push(newTransaccion);
    return Promise.resolve(newTransaccion);
  }

  async update(id: number, data: Partial<Transaccion>): Promise<Transaccion> {
    const index = this.transaccionesDB.findIndex(
      (t) => t.id_transaccion === id,
    );
    if (index === -1) throw new Error("Transacción no encontrada");
    this.transaccionesDB[index] = { ...this.transaccionesDB[index], ...data };
    return Promise.resolve(this.transaccionesDB[index]);
  }

  async delete(id: number): Promise<string> {
    this.transaccionesDB = this.transaccionesDB.filter(
      (t) => t.id_transaccion !== id,
    );
    return Promise.resolve("Transacción eliminada correctamente");
  }

  async getResumen(id_usuario: number): Promise<ResumenFinanciero> {
    const transaccionesUsuario = this.transaccionesDB.filter(
      (t) => t.id_usuario === id_usuario,
    );
    const transaccionesUsuarioDTO: TransaccionDTO[] =
      transaccionesUsuario.map(toTransaccionDTO);

    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    const transaccionesMes = transaccionesUsuarioDTO.filter((t) => {
      const fecha = new Date(t.fecha);
      return (
        fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual
      );
    });

    // Resumen mensual
    let ingresosMes = 0;
    let gastosMes = 0;

    transaccionesMes.forEach((t) => {
      const categoria = this.categoriasDB.find(
        (c) => c.id_categoria === t.id_categoria,
      );
      if (categoria.tipo === "INGRESO") {
        ingresosMes += t.monto;
      } else {
        gastosMes += t.monto;
      }
    });

    // Resumen total
    let ingresosTotales = 0;
    let gastosTotales = 0;

    transaccionesUsuarioDTO.forEach((t) => {
      const categoria = this.categoriasDB.find(
        (c) => c.id_categoria === t.id_categoria,
      );
      if (categoria.tipo === "INGRESO") {
        ingresosTotales += t.monto;
      } else {
        gastosTotales += t.monto;
      }
    });

    // Conteo y monto total

    const total = transaccionesUsuarioDTO.length;

    return Promise.resolve({
      transacciones: transaccionesUsuarioDTO,
      resumenMensual: {
        ingresos: ingresosMes,
        gastos: gastosMes,
        balance: ingresosMes - gastosMes,
      },
      resumenTotal: {
        ingresos: ingresosTotales,
        gastos: gastosTotales,
        balance: ingresosTotales - gastosTotales,
      },
      cantidadTransacciones: total,
    });
  }
}
