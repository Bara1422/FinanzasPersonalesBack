import { Request, Response } from 'express';
import { TipoTransaccion } from '@prisma/client';
import { ServiceCategory } from '../services/category.service';

const categoryService = new ServiceCategory();

export const getCategory = async (req: Request, res: Response) => {
    try {
        const tipo = req.query.tipo as TipoTransaccion | undefined;

        if (tipo && !["INGRESO", "GASTO"].includes(tipo)) {
            return res.status(400).json({
                ok: false,
                error: 'Error de parametros: Tipo de transaccion no valido.'
            });
        }

        const categorias = await categoryService.getCategory(tipo);

        return res.status(200).json({
            ok: true,
            data: categorias
        });
    } catch (error) {
        console.error('Error al obtener categorias', error);
        return res.status(500).json({
            ok: false,
            error: 'Error interno del servidor'
        });
    }
};