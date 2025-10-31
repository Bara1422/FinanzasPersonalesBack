import { Categoria, TipoTransaccion } from '@prisma/client';

export interface ICategoryRepository {
    getCategory(tipo?: TipoTransaccion): Promise<Categoria[]>;
}