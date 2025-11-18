import type { Transaccion } from "@prisma/client";

export interface TransaccionDTO {
  id_transaccion: number;
  id_usuario: number;
  id_categoria: number;
  monto: number;
  descripcion: string | null;
  fecha: Date;
}

export function toTransaccionDTO(transaccion: Transaccion): TransaccionDTO {
  return {
    id_transaccion: transaccion.id_transaccion,
    id_usuario: transaccion.id_usuario,
    id_categoria: transaccion.id_categoria,
    monto: transaccion.monto,
    descripcion: transaccion.descripcion,
    fecha: transaccion.created_at,
  };
}
