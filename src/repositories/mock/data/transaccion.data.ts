import type { Transaccion } from "@prisma/client";

export const transaccionesMock: Transaccion[] = [
  {
    id_transaccion: 1,
    id_usuario: 1,
    id_categoria: 1,
    monto: 20000.5,
    descripcion: "Compra de alimentos",
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_transaccion: 2,
    id_usuario: 1,
    id_categoria: 3,
    monto: 600000,
    descripcion: "Pago alquiler",
    created_at: new Date("2024-06-15"),
    updated_at: new Date(),
  },
  {
    id_transaccion: 3,
    id_usuario: 1,
    id_categoria: 11,
    monto: 700000.0,
    descripcion: "Salario mensual",
    created_at: new Date("2025-11-09"),
    updated_at: new Date(),
  },
];
