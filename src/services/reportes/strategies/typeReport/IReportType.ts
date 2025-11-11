export interface IReportType<T> {
  generar(id_usuario: number): Promise<{ data: T[]; title: string }>;
}
