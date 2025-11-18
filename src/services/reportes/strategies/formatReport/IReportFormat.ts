export interface IReportFormat<T> {
  export(data: T[], title: string): Promise<Buffer>;
}
