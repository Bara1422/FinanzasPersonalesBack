import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  addUsuario,
  findUsuarioByEmail,
  findUsuarioByUsername,
  findUsuarioById,
  Usuario
} from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 10;

// Hasheamos la contraseña del usuario
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};
// Comparamos la contraseña ingresada con el hash almacenado
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
// Registramos un nuevo usuario
export const registerUsuario = async (data: {
  name: string;
  email: string;
  username: string;
  password: string;
  rol?: string;
}) => {
  const existingEmail = await findUsuarioByEmail(data.email);
  if (existingEmail) throw new Error('UserExistsEmail');
  const existingUsername = await findUsuarioByUsername(data.username);
  if (existingUsername) throw new Error('UserExistsUsername');
  const password_hash = await hashPassword(data.password);
  return addUsuario({
    name: data.name,
    email: data.email,
    username: data.username,
    password_hash,
    rol: data.rol || 'user'
  }) as Promise<Usuario>;
};
// Generamos un token JWT para el usuario
export const generateToken = (usuario: Usuario): string => {
  const payload = {
    id_usuario: usuario.id_usuario,
    email: usuario.email,
    username: usuario.username,
    rol: usuario.rol
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};
// Verificamos y decodificamos el token JWT
export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};

// re-export for controller convenience (async)
export const findUsuarioByEmailOrUsername = async (identifier: string) => {
  // Permite login por email o username
  const byEmail = await findUsuarioByEmail(identifier);
  if (byEmail) return byEmail;
  return findUsuarioByUsername(identifier);
};

export const findUsuarioByIdAsync = async (id_usuario: number) => {
  return findUsuarioById(id_usuario);
};