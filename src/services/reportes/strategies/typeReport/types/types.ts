export interface CategoriesReportData {
  Categoria: string;
  Tipo: string;
  Total: string;
}

export interface UserReportData {
  Usuario: string;
  Email: string;
  Username: string;
  Fecha_creacion: Date;
  Gastos_ultimo_mes: string;
  Ingresos_ultimo_mes: string;
  Balance_ultimo_mes: string;
  Total_ingresos: string;
  Total_gastos: string;
  Balance: string;
  Total_transacciones: number;
}

export interface TransactionsReportData {
  Fecha: Date;
  Monto: string;
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
