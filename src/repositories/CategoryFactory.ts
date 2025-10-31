// factories/CategoryRepositoryFactory.ts

// Importamos la interfaz (el Contrato)
import { ICategoryRepository } from '../repositories/interfaces/ICategoryRepository'; 

import { ServiceCategory } from '../services/category.service'; 
import { CategoriaMockService } from './mock/CategoryMockService'; 

export class CategoryRepositoryFactory {
  static createCategoryRepository(): ICategoryRepository {
    
    // Usamos 'development' o 'test' para activar mocks, similar a tu ejemplo.
    const useMock = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"; 

    if (useMock) {
      console.log("⚠️ Inyectando CategoriaMockService.");
      // Devolvemos la implementación Mock
      return new CategoriaMockService(); 
    } else {
      console.log("✅ Inyectando ServiceCategory (Prisma).");
      // Devolvemos la implementación Real
      return new ServiceCategory(); 
    }
  }
}