import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

// Controlador para el registro de usuarios
export const register = async (req: Request, res: Response) => {
    try {
        const { email, username, name, password, rol } = req.body;

        if (!email || !username || !name || !password) {
            return res.status(400).json({ message: 'Faltan campos requeridos: email, username, name, password' });
        }

        try {
            const usuario = await authService.registerUsuario({ email, username, name, password, rol });
            const token = authService.generateToken(usuario);
            return res.status(201).json({
                message: 'Usuario registrado exitosamente',
                token,
                usuario: {
                    id_usuario: usuario.id_usuario,
                    email: usuario.email,
                    username: usuario.username,
                    name: usuario.name,
                    rol: usuario.rol,
                    activo: usuario.activo
                }
            });
        } catch (err: any) {
            if (err.message === 'UserExistsEmail') {
                return res.status(409).json({ message: 'El email ya está registrado' });
            }
            if (err.message === 'UserExistsUsername') {
                return res.status(409).json({ message: 'El username ya está registrado' });
            }
            throw err;
        }
    } catch (error: any) {
        res.status(500).json({
            message: 'Error al registrar usuario',
            error: error.message || error
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { identifier, password } = req.body;
        // identifier puede ser email o username
        if (!identifier || !password) {
            return res.status(400).json({ message: 'Faltan campos requeridos: identifier (email o username), password' });
        }
        
        const usuario = await authService.findUsuarioByEmailOrUsername(identifier);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const match = await authService.comparePassword(password, usuario.password_hash);
        if (!match) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        
        const token = authService.generateToken(usuario);
        return res.status(200).json({ message: 'Login exitoso', token });
    } catch (error: any) {
        res.status(500).json({
            message: 'Error al iniciar sesión',
            error: error.message || error
        });
    }
};
