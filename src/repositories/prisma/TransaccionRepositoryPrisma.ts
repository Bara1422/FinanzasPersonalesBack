import type { Transaccion } from "@prisma/client";
import prisma from "../../db/prisma";
import type { ITransaccionRepository } from "../interfaces/ITransaccionRepository";

export class TransaccionRepositoryPrisma implements ITransaccionRepository<Transaccion> {
  
  async findAll(): Promise<Transaccion[]> {
    return await prisma.transaccion.findMany({
      include: { categoria: true },
    });
  }

  async findById(id: number): Promise<Transaccion | null> {
    return await prisma.transaccion.findUnique({
      where: { id_transaccion: id },
      include: { categoria: true },
    });
  }

  async findByUserId(id_usuario: number): Promise<Transaccion[]> {
    return await prisma.transaccion.findMany({
      where: { id_usuario },
      include: { categoria: true },
      orderBy: { created_at: "desc" },
    });
  }

  async create(data: Partial<Transaccion>): Promise<Transaccion> {
    if (!data.id_usuario || !data.id_categoria || data.monto === undefined) {
      throw new Error("id_usuario, id_categoria y monto son obligatorios");
    }

    return await prisma.transaccion.create({
      data: {
        id_usuario: data.id_usuario,
        id_categoria: data.id_categoria,
        monto: data.monto,
        descripcion: data.descripcion || "",
      },
      include: { categoria: true },
    });
  }

  async update(id: number, data: Partial<Transaccion>): Promise<Transaccion> {
    return await prisma.transaccion.update({
      where: { id_transaccion: id },
      data: {
        ...data,
      },
      include: { categoria: true },
    });
  }

  async delete(id: number): Promise<string> {
    await prisma.transaccion.delete({
      where: { id_transaccion: id },
    });
    return "Transacción eliminada correctamente";
  }

  /*
   Devuelve un resumen financiero (mensual y total)
   */
  async getResumen(id_usuario: number): Promise<any> {
    const transacciones = await prisma.transaccion.findMany({
      where: { id_usuario },
      include: { categoria: true },
      orderBy: { created_at: "desc" },
    });

    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const añoActual = ahora.getFullYear();

    const delMes = transacciones.filter(
      (t) =>
        t.created_at.getMonth() === mesActual &&
        t.created_at.getFullYear() === añoActual
    );

    const ingresosMes = delMes
      .filter((t) => t.categoria.tipo === "INGRESO")
      .reduce((sum, t) => sum + Number(t.monto), 0);

    const gastosMes = delMes
      .filter((t) => t.categoria.tipo === "GASTO")
      .reduce((sum, t) => sum + Number(t.monto), 0);

    const ingresosTotales = transacciones
      .filter((t) => t.categoria.tipo === "INGRESO")
      .reduce((sum, t) => sum + Number(t.monto), 0);

    const gastosTotales = transacciones
      .filter((t) => t.categoria.tipo === "GASTO")
      .reduce((sum, t) => sum + Number(t.monto), 0);

    return {
      ingresosMes,
      gastosMes,
      balanceMes: ingresosMes - gastosMes,
      ingresosTotales,
      gastosTotales,
      balanceTotal: ingresosTotales - gastosTotales,
      transacciones,
    };
  }
}
