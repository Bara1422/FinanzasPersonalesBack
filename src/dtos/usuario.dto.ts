import type { $Enums, Usuario } from "@prisma/client";

export interface UsuarioDTO {
  id_usuario: number;
  name: string;
  email: string;
  username: string;
  rol: $Enums.Rol;
  created_at: Date;
}

export const toUsuarioDTO = (usuario: Usuario): UsuarioDTO => {
  return {
    id_usuario: usuario.id_usuario,
    name: usuario.name,
    email: usuario.email,
    username: usuario.username,
    rol: usuario.rol,
    created_at: usuario.created_at,
  };
};
