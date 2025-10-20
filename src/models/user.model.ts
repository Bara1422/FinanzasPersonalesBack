import prisma from '../db/prisma';
// Definimos el tipo Usuario basado en la tabla usuario de la base de datos
export type Usuario = {
  id_usuario: number;
  name: string;
  password_hash: string;
  email: string;
  username: string;
  rol: string;
  activo: boolean;
  created_at: Date;
  updated_at: Date;
};
// Agregamos un nuevo usuario a la base de datos
export const addUsuario = async (data: {
  name: string;
  password_hash: string;
  email: string;
  username: string;
  rol?: string;
  activo?: boolean;
}) => {
  return prisma.usuario.create({
    data: {
      ...data,
      rol: data.rol || 'user',
      activo: data.activo !== undefined ? data.activo : true
    }
  });
};
// Buscamos un usuario por su email
export const findUsuarioByEmail = async (email: string) => {
  return prisma.usuario.findUnique({ where: { email } });
};
// Buscamos un usuario por su username
export const findUsuarioByUsername = async (username: string) => {
  return prisma.usuario.findUnique({ where: { username } });
};
// Buscamos un usuario por su id_usuario
export const findUsuarioById = async (id_usuario: number) => {
  return prisma.usuario.findUnique({ where: { id_usuario } });
};