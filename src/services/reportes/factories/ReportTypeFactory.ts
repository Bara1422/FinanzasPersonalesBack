import { AllUsersReport } from "../strategies/typeReport/AllUsersReport";
import { CategoriesReport } from "../strategies/typeReport/CategoriesReport";
import type { IReportType } from "../strategies/typeReport/IReportType";
import { NotificationsReport } from "../strategies/typeReport/NotificationsReport";
import { TransactionsReport } from "../strategies/typeReport/TransactionsReport";
import { UserReport } from "../strategies/typeReport/UserReport";

export class ReportTypeFactory {
  static getReportType(type: string): IReportType<any> {
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
