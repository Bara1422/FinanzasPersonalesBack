import type { Transaccion } from "@prisma/client";
import { toTransaccionDTO } from "../dtos/transaccion.dto";
import type { ITransaccionRepository } from "../repositories/interfaces/ITransaccionRepository";

export class TransaccionService {
  constructor(
    private transaccionRepository: ITransaccionRepository<Transaccion>,
  ) {}

  //Crear una nueva transacción

  async crearTransaccion(data: Partial<Transaccion>, id_usuario: number) {
    // Validacion
    if (!id_usuario) {
      throw new Error("Falta el ID del usuario");
    }

    if (!data.monto || data.monto <= 0) {
      throw new Error("El monto debe ser mayor que 0");
    }

    // Crear transacción
    const nuevaTransaccion = await this.transaccionRepository.create(
      data,
      id_usuario,
    );
    return toTransaccionDTO(nuevaTransaccion);
  }

  // Obtiene todas las transacciones
  async obtenerTodasLasTransacciones() {
    const transacciones = await this.transaccionRepository.findAll();
    return transacciones.map(toTransaccionDTO);
  }

  //Obtiene todas las transacciones del usuario

  async obtenerTransaccionesUsuario(id_usuario: number) {
    if (!id_usuario) {
      throw new Error("ID de usuario no válido");
    }
    const transaccionesPorUsuario =
      await this.transaccionRepository.findByUserId(id_usuario);

    return transaccionesPorUsuario.map(toTransaccionDTO);
  }

  //Obtener una transacción por su ID

  async obtenerTransaccionPorId(id_transaccion: number, id_usuario: number) {
    if (!id_transaccion) {
      throw new Error("ID de transacción no válido");
    }
    const transaccion =
      await this.transaccionRepository.findById(id_transaccion);
    if (!transaccion || transaccion.id_usuario !== id_usuario) {
      throw new Error("Transacción no encontrada");
    }
    return toTransaccionDTO(transaccion);
  }

  //Actualiza transacción

  async actualizarTransaccion(
    id_transaccion: number,
    data: Partial<Transaccion>,
    id_usuario: number,
  ) {
    if (!id_transaccion) {
      throw new Error("ID de transacción no válido");
    }

    const existente = await this.transaccionRepository.findById(id_transaccion);
    if (!existente) {
      throw new Error("Transacción no encontrada");
    }
    if (existente.id_usuario !== id_usuario) {
      throw new Error("No tienes permiso para actualizar esta transacción");
    }

    const transaccionActualizada = await this.transaccionRepository.update(
      id_transaccion,
      data,
    );
    return toTransaccionDTO(transaccionActualizada);
  }

  //Eliminar transacción

  async eliminarTransaccion(id_transaccion: number, id_usuario: number) {
    if (!id_transaccion) {
      throw new Error("ID de transacción no válido");
    }

    const existente = await this.transaccionRepository.findById(id_transaccion);
    if (!existente) {
      throw new Error("Transacción no encontrada");
    }

    if (existente.id_usuario !== id_usuario) {
      throw new Error("No tienes permiso para eliminar esta transacción");
    }

    return await this.transaccionRepository.delete(id_transaccion);
  }

  //Obtener resumen financiero

  async obtenerResumenFinanciero(id_usuario: number) {
    if (!id_usuario) {
      throw new Error("ID de usuario no válido");
    }
    return await this.transaccionRepository.getResumen(id_usuario);
  }
}
