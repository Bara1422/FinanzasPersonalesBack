import type { Transaccion } from "@prisma/client";
import { toTransaccionDTO } from "../dtos/transaccion.dto";
import type { ITransaccionRepository } from "../repositories/interfaces/ITransaccionRepository";
import { CustomError } from "../utils/CustomError";

export class TransaccionService {
  constructor(
    private transaccionRepository: ITransaccionRepository<Transaccion>,
  ) {}

  async crearTransaccion(data: Partial<Transaccion>, id_usuario: number) {
    const nuevaTransaccion = await this.transaccionRepository.create(
      data,
      id_usuario,
    );
    return toTransaccionDTO(nuevaTransaccion);
  }

  async obtenerTodasLasTransacciones() {
    const transacciones = await this.transaccionRepository.findAll();
    return transacciones.map(toTransaccionDTO);
  }

  async obtenerTransaccionesUsuario(id_usuario: number) {
    const transaccionesPorUsuario =
      await this.transaccionRepository.findByUserId(id_usuario);

    return transaccionesPorUsuario.map(toTransaccionDTO);
  }

  //Obtener una transacción por su ID

  async obtenerTransaccionPorId(id_transaccion: number, id_usuario: number) {
    const transaccion =
      await this.transaccionRepository.findById(id_transaccion);
    if (!transaccion) {
      throw new CustomError("Transacción no encontrada", 404);
    }

    if (transaccion.id_usuario !== id_usuario) {
      throw new CustomError("No tienes permiso para ver esta transacción", 403);
    }
    return toTransaccionDTO(transaccion);
  }

  async actualizarTransaccion(
    id_transaccion: number,
    data: Partial<Transaccion>,
    id_usuario: number,
  ) {
    const existente = await this.transaccionRepository.findById(id_transaccion);
    if (!existente) {
      throw new CustomError("Transacción no encontrada", 404);
    }
    if (existente.id_usuario !== id_usuario) {
      throw new CustomError(
        "No tienes permiso para actualizar esta transacción",
        403,
      );
    }

    const transaccionActualizada = await this.transaccionRepository.update(
      id_transaccion,
      data,
    );
    return toTransaccionDTO(transaccionActualizada);
  }

  async eliminarTransaccion(id_transaccion: number, id_usuario: number) {
    const existente = await this.transaccionRepository.findById(id_transaccion);
    if (!existente) {
      throw new CustomError("Transacción no encontrada", 404);
    }

    if (existente.id_usuario !== id_usuario) {
      throw new CustomError(
        "No tienes permiso para eliminar esta transacción",
        403,
      );
    }

    return await this.transaccionRepository.delete(id_transaccion);
  }

  async obtenerResumenFinanciero(id_usuario: number) {
    return await this.transaccionRepository.getResumen(id_usuario);
  }
}
