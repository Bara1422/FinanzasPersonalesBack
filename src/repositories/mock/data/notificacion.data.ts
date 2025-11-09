import { $Enums, type Notificacion } from "@prisma/client";

export const notificacionesMock: Notificacion[] = [
  {
    id_notificacion: 1,
    id_usuario: 1,
    id_categoria: 1, // Alimentos
    monto: 25000,
    descripcion: "Compra supermercado",
    fecha_vencimiento: new Date("2025-12-03T00:00:00.000Z"),
    pagado: false,
    prioridad: $Enums.Prioridad.MEDIA,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id_notificacion: 2,
    id_usuario: 1,
    id_categoria: 2,
    monto: 40000,
    pagado: false,
    prioridad: $Enums.Prioridad.MEDIA,
    created_at: new Date(),
    updated_at: new Date(),
    descripcion: "Nafta",
    fecha_vencimiento: new Date("2025-12-01T00:00:00.000Z"),
  },
  {
    id_notificacion: 3,
    id_usuario: 1,
    id_categoria: 1, // Alimentos
    monto: 30000,
    pagado: false,
    prioridad: $Enums.Prioridad.MEDIA,
    created_at: new Date(),
    updated_at: new Date(),
    descripcion: "Restaurante",
    fecha_vencimiento: new Date("2025-12-04T00:00:00.000Z"),
  },
  {
    id_notificacion: 4,
    id_usuario: 1,
    id_categoria: 8, // Tecnología
    monto: 20000,
    pagado: false,
    prioridad: $Enums.Prioridad.MEDIA,
    created_at: new Date(),
    updated_at: new Date(),
    descripcion: "Mouse gamer",
    fecha_vencimiento: new Date("2025-12-06T00:00:00.000Z"),
  },
  {
    id_notificacion: 5,
    id_usuario: 2,
    id_categoria: 3, // Vivienda
    monto: 600000,
    descripcion: "Alquiler",
    pagado: false,
    prioridad: $Enums.Prioridad.MEDIA,
    created_at: new Date(),
    updated_at: new Date(),
    fecha_vencimiento: new Date("2025-12-02T00:00:00.000Z"),
  },
  {
    id_notificacion: 6,
    id_usuario: 2,
    id_categoria: 1, // Alimentos
    monto: 50000,
    pagado: false,
    prioridad: $Enums.Prioridad.MEDIA,
    created_at: new Date(),
    updated_at: new Date(),
    descripcion: "Supermercado",
    fecha_vencimiento: new Date("2025-12-03T00:00:00.000Z"),
  },
];
