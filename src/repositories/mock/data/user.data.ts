import type { $Enums, Usuario } from "@prisma/client";
import { BcryptAdapter } from "../../../config/bcrypt";

const hasher = new BcryptAdapter();

export const userMock: Usuario[] = [
  {
    id_usuario: 1,
    name: "Admin",
    email: "admin@example.com",
    username: "admin",
    password: hasher.hash("123456"),
    rol: "ADMIN" as $Enums.Rol,
    created_at: new Date(),
    updated_at: new Date(),
    activo: true,
  },
  {
    id_usuario: 2,
    name: "User",
    email: "user@example.com",
    username: "user",
    password: hasher.hash("123456"),
    rol: "USER" as $Enums.Rol,
    created_at: new Date(),
    updated_at: new Date(),
    activo: true,
  },
];
