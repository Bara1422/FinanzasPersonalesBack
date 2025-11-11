export interface CategoriesReportData {
  Categoria: string;
  Tipo: string;
  Total: number;
}

export interface UserReportData {
  Usuario: string;
  Email: string;
  Username: string;
  Fecha_creacion: Date;
  Gastos_ultimo_mes: number;
  Ingresos_ultimo_mes: number;
  Balance_ultimo_mes: number;
  Total_ingresos: number;
  Total_gastos: number;
  Balance: number;
  Total_transacciones: number;
}

export interface TransactionsReportData {
  Fecha: Date;
  Monto: number;
  Categoria: string;
  Tipo: string;
  Descripción: string;
}

export interface NotificationsReportData {
  Descripcion: string;
  Fecha: Date;
  Estado: string;
  Monto: string;
  Prioridad: string;
}

export type ReportData =
  | CategoriesReportData
  | TransactionsReportData
  | UserReportData
  | NotificationsReportData;