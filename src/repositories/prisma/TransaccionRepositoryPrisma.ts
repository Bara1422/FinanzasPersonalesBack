import type { Transaccion } from "@prisma/client";
import prisma from "../../db/prisma";
import {
  type TransaccionDTO,
  toTransaccionDTO,
} from "../../dtos/transaccion.dto";
import type { ResumenFinanciero } from "../../types/transaction.types";
import type { ITransaccionRepository } from "../interfaces/ITransaccionRepository";

export class TransaccionRepositoryPrisma
  implements ITransaccionRepository<Transaccion>
{
  async findAll(): Promise<Transaccion[]> {
    return await prisma.transaccion.findMany({
      include: { categoria: { select: { id_categoria: true } } },
    });
  }

  async findById(id: number): Promise<Transaccion | null> {
    return await prisma.transaccion.findUnique({
      where: { id_transaccion: id },
      include: { categoria: { select: { id_categoria: true } } },
    });
  }

  async findByUserId(id_usuario: number): Promise<Transaccion[]> {
    return await prisma.transaccion.findMany({
      where: { id_usuario },
      include: { categoria: true },
      orderBy: { created_at: "desc" },
    });
  }

  async create(
    data: Partial<Transaccion>,
    id_usuario: number,
  ): Promise<Transaccion> {
    return await prisma.transaccion.create({
      data: {
        id_usuario: id_usuario,
        id_categoria: data.id_categoria,
        monto: data.monto,
        descripcion: data.descripcion,
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
  async getResumen(id_usuario: number): Promise<ResumenFinanciero> {
    const transaccionesUsuario = await prisma.transaccion.findMany({
      where: { id_usuario },
      include: { categoria: true },
      orderBy: { created_at: "desc" },
    });

    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();

    const transaccionesMes = transaccionesUsuario.filter((t) => {
      const fecha = new Date(t.created_at);
      return (
        fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual
      );
    });

    let ingresosMes = 0;
    let gastosMes = 0;

    transaccionesMes.forEach((t) => {
      if (t.categoria.tipo === "INGRESO") {
        ingresosMes += Number(t.monto);
      } else {
        gastosMes += Number(t.monto);
      }
    });

    let ingresosTotales = 0;
    let gastosTotales = 0;

    transaccionesUsuario.forEach((t) => {
      if (t.categoria.tipo === "INGRESO") {
        ingresosTotales += Number(t.monto);
      } else {
        gastosTotales += Number(t.monto);
      }
    });

    const transaccionesUsuarioDTO: TransaccionDTO[] =
      transaccionesUsuario.map(toTransaccionDTO);

    return {
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
      cantidadTransacciones: transaccionesUsuarioDTO.length,
    };
  }
}
