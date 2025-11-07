import { $Enums, type Notificacion } from "@prisma/client";

export const notificacionesMock: Notificacion[] = [
  {
    id_notificacion: 1,
    id_usuario: 1,
    id_categoria: 1, // Alimentos
    monto: 2500,
    descripcion: "Compra supermercado",
    fecha_vencimiento: new Date("2025-10-01"),
    pagado: false,
    prioridad: $Enums.Prioridad.MEDIA,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_notificacion: 2,
    id_usuario: 1,
    id_categoria: 2,
    monto: 800,
    pagado: false,
    prioridad: $Enums.Prioridad.MEDIA,
    created_at: new Date(),
    updated_at: new Date(),
    descripcion: "Nafta",
    fecha_vencimiento: new Date("2025-10-03"),
  },
  {
    id_notificacion: 3,
    id_usuario: 1,
    id_categoria: 1, // Alimentos
    monto: 1200,
    pagado: false,
    prioridad: $Enums.Prioridad.MEDIA,
    created_at: new Date(),
    updated_at: new Date(),
    descripcion: "Restaurante",
    fecha_vencimiento: new Date("2025-10-04"),
  },
  {
    id_notificacion: 4,
    id_usuario: 1,
    id_categoria: 8, // Tecnología
    monto: 6000,
    pagado: false,
    prioridad: $Enums.Prioridad.MEDIA,
    created_at: new Date(),
    updated_at: new Date(),
    descripcion: "Mouse gamer",
    fecha_vencimiento: new Date("2025-10-06"),
  },
  {
    id_notificacion: 5,
    id_usuario: 2,
    id_categoria: 3, // Vivienda
    monto: 20000,
    descripcion: "Alquiler",
    pagado: false,
    prioridad: $Enums.Prioridad.MEDIA,
    created_at: new Date(),
    updated_at: new Date(),
    fecha_vencimiento: new Date("2025-10-02"),
  },
  {
    id_notificacion: 6,
    id_usuario: 2,
    id_categoria: 1, // Alimentos
    monto: 5000,
    pagado: false,
    prioridad: $Enums.Prioridad.MEDIA,
    created_at: new Date(),
    updated_at: new Date(),
    descripcion: "Supermercado",
    fecha_vencimiento: new Date("2025-10-03"),
  },
  {
    id_notificacion: 7,
    id_usuario: 1,
    id_categoria: 11, // Sueldo
    monto: 5000,
    descripcion: "Sueldo mensual",
    pagado: false,
    prioridad: $Enums.Prioridad.MEDIA,
    created_at: new Date(),
    updated_at: new Date(),
    fecha_vencimiento: new Date("2025-10-01"),
  },
];
