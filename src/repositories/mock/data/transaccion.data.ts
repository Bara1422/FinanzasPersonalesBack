import type { Transaccion } from "@prisma/client";

export const transaccionesMock: Transaccion[] = [
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
  {
    id_transaccion: 3,
    id_usuario: 1,
    id_categoria: 10,
    monto: 2000.0,
    descripcion: "Salario mensual",
    created_at: new Date("2025-11-09"),
    updated_at: new Date(),
  },
];
