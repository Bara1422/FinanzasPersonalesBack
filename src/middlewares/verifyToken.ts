import { Request, Response, NextFunction } from 'express';
import { verifyToken as svcVerifyToken } from '../services/auth.service';

declare module 'express-serve-static-core' {
	interface Request {
		user?: any;
	}
}
// Middleware para verificar el token JWT en las solicitudes protegidas
const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'] || req.headers['Authorization'];
	const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
		? authHeader.slice(7)
		: undefined;

	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}

	try {
		const payload = svcVerifyToken(token);
		req.user = payload;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Invalid token', error: err.message });
	}
};

export default verifyToken;

