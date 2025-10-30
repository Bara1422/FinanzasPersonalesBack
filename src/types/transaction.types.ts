import type { TransaccionDTO } from "../dtos/transaccion.dto";

export interface ResumenPeriodo {
  ingresos: number;
  gastos: number;
  balance: number;
}

export interface ResumenFinanciero {
  transacciones: TransaccionDTO[];
  resumenMensual: ResumenPeriodo;
  resumenTotal: ResumenPeriodo;
  cantidadTransacciones: number;
}
