import type { Transaccion } from "@prisma/client";
import { TransaccionRepositoryPrisma } from "../repositories/prisma/TransaccionRepositoryPrisma";

export class TransaccionService {
  private transaccionRepository: TransaccionRepositoryPrisma;

  constructor() {
    this.transaccionRepository = new TransaccionRepositoryPrisma();
  }

  //Crear una nueva transacción

  async crearTransaccion(data: Partial<Transaccion>): Promise<Transaccion> {
    // Validacion
    if (!data.id_usuario) {
      throw new Error("Falta el ID del usuario");
    }
    if (!data.tipo) {
      throw new Error("Debe especificar el tipo de transacción (INGRESO o GASTO)");
    }
    if (!data.monto || data.monto <= 0) {
      throw new Error("El monto debe ser mayor que 0");
    }

    // Crear transacción
    const nueva = await this.transaccionRepository.create(data);
    return nueva;
  }

  //Obtiene todas las transacciones del usuario

  async obtenerTransaccionesUsuario(id_usuario: number): Promise<Transaccion[]> {
    if (!id_usuario) {
      throw new Error("ID de usuario no válido");
    }
    return await this.transaccionRepository.findByUserId(id_usuario);
  }

  
  //Obtener una transacción por su ID

  async obtenerTransaccionPorId(id: number): Promise<Transaccion | null> {
    if (!id) {
      throw new Error("ID de transacción no válido");
    }
    const transaccion = await this.transaccionRepository.findById(id);
    if (!transaccion) {
      throw new Error("Transacción no encontrada");
    }
    return transaccion;
  }

  
  //Actualiza transacción
  
  async actualizarTransaccion(id: number, data: Partial<Transaccion>): Promise<Transaccion> {
    if (!id) {
      throw new Error("ID de transacción no válido");
    }

    const existente = await this.transaccionRepository.findById(id);
    if (!existente) {
      throw new Error("Transacción no encontrada");
    }

    return await this.transaccionRepository.update(id, data);
  }

  
  //Eliminar transacción

  async eliminarTransaccion(id: number): Promise<string> {
    if (!id) {
      throw new Error("ID de transacción no válido");
    }

    const existente = await this.transaccionRepository.findById(id);
    if (!existente) {
      throw new Error("Transacción no encontrada");
    }

    return await this.transaccionRepository.delete(id);
  }


  //Obtener resumen financiero
  
  async obtenerResumenFinanciero(id_usuario: number): Promise<any> {
    if (!id_usuario) {
      throw new Error("ID de usuario no válido");
    }
    return await this.transaccionRepository.getResumen(id_usuario);
  }
}
