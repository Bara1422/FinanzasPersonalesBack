import { PrismaClient, TipoTransaccion, Categoria } from '@prisma/client';
import { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository';


export class ServiceCategory implements ICategoryRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }
    public async getCategory(tipo?: TipoTransaccion): Promise<Categoria[]> {
        const categorias = await this.prisma.categoria.findMany({
            include: {
                transacciones: {
                    where: {
                        ...(tipo ? { tipo } : {})
                    },
                    orderBy: { fecha: 'desc' }
                }
            },
            orderBy: { id_categoria: 'asc' }
        });

        return categorias;
    }
}