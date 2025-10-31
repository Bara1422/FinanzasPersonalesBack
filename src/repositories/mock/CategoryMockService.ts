import { TipoTransaccion, Categoria } from '@prisma/client';
import { ICategoryRepository } from '../interfaces/ICategoryRepository';

type TransaccionMock = { 
    id_transaccion: number, 
    fecha: Date, 
    descripcion: string, 
    monto: number, 
    tipo: TipoTransaccion, 
    id_categoria: number 
};

type CategoriaMock = Omit<Categoria, 'transacciones'> & { 
    transacciones: TransaccionMock[]; 
    tipo_defecto?: 'INGRESO' | 'GASTO' | null;
};

const MOCK_CATEGORIAS_DATA: CategoriaMock[] = [
    { 
        id_categoria: 1, 
        nombre: 'Salario', 
        tipo_defecto: 'INGRESO',
        transacciones: [
            { id_transaccion: 101, fecha: new Date('2025-10-25'), descripcion: 'Nómina de Octubre', monto: 3000, tipo: 'INGRESO', id_categoria: 1 },
        ]
    },
    { 
        id_categoria: 2, 
        nombre: 'Alquiler', 
        tipo_defecto: 'GASTO',
        transacciones: [
            { id_transaccion: 201, fecha: new Date('2025-10-01'), descripcion: 'Renta del mes', monto: 1200, tipo: 'GASTO', id_categoria: 2 },
            { id_transaccion: 202, fecha: new Date('2025-11-01'), descripcion: 'Renta Noviembre (Próx)', monto: 1200, tipo: 'GASTO', id_categoria: 2 },
        ]
    },
    { 
        id_categoria: 3, 
        nombre: 'Comida', 
        tipo_defecto: 'GASTO',
        transacciones: [
            { id_transaccion: 301, fecha: new Date('2025-10-27'), descripcion: 'Supermercado', monto: 150, tipo: 'GASTO', id_categoria: 3 },
            { id_transaccion: 302, fecha: new Date('2025-10-28'), descripcion: 'Cafetería', monto: 15, tipo: 'GASTO', id_categoria: 3 },
        ]
    },
    { 
        id_categoria: 4, 
        nombre: 'Intereses', 
        tipo_defecto: 'INGRESO',
        transacciones: [
            { id_transaccion: 401, fecha: new Date('2025-10-15'), descripcion: 'Intereses Bancarios', monto: 50, tipo: 'INGRESO', id_categoria: 4 },
        ]
    }
];


export class CategoriaMockService implements ICategoryRepository {
    
    public async getCategory(tipo?: TipoTransaccion): Promise<Categoria[]> {
        
        await new Promise(resolve => setTimeout(resolve, 50)); 
        
        console.log(`[MOCK] Solicitando categorías con filtro: ${tipo || 'TODOS'}`);
        
        if (!tipo) {
            return MOCK_CATEGORIAS_DATA as any;
        }

        const categoriasFiltradas = MOCK_CATEGORIAS_DATA.map(categoria => {
            
            const transaccionesFiltradas = categoria.transacciones.filter(t => t.tipo === tipo);

            return {
                ...categoria,
                transacciones: transaccionesFiltradas
            };
        });

        return categoriasFiltradas.filter(c => c.transacciones.length > 0) as any;
    }
}