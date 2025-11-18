import type { TipoReporte } from "../../../schemas/reporte.schema";
import { AllUsersReport } from "../strategies/typeReport/AllUsersReport";
import { CategoriesReport } from "../strategies/typeReport/CategoriesReport";
import type { IReportType } from "../strategies/typeReport/IReportType";
import { NotificationsReport } from "../strategies/typeReport/NotificationsReport";
import { TransactionsReport } from "../strategies/typeReport/TransactionsReport";
import type { ReportData } from "../strategies/typeReport/types/types";
import { UserReport } from "../strategies/typeReport/UserReport";

export class ReportTypeFactory {
  static getReportType(type: TipoReporte): IReportType<ReportData> {
    switch (type) {
      case "usuario":
        return new UserReport();
      case "transacciones":
        return new TransactionsReport();
      case "categorias":
        return new CategoriesReport();
      case "notificaciones":
        return new NotificationsReport();
      case "todos_usuarios":
        return new AllUsersReport();
      default:
        throw new Error("Tipo de reporte no soportado");
    }
  }
}
