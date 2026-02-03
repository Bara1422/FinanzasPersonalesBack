import type { Categoria } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CategoryService } from "../../src/services/category.service";
import { CustomError } from "../../src/utils/CustomError";

describe("CategoryService", () => {
  let repo: any;
  let service: CategoryService;

  const categoriaMock: Categoria = {
    id_categoria: 1,
    nombre: "Comida",
    tipo: "GASTO" as any,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    repo = {
      getCategory: vi.fn(),
      getAllCategories: vi.fn(),
      getById: vi.fn(),
    };

    service = new CategoryService(repo);
  });

  it("getAllCategories: devuelve categorías", async () => {
    repo.getAllCategories.mockResolvedValue([categoriaMock]);

    const res = await service.getAllCategories();

    expect(repo.getAllCategories).toHaveBeenCalled();
    expect(res).toEqual([categoriaMock]);
  });

  it("getCategory: llama al repo con tipo", async () => {
    repo.getCategory.mockResolvedValue([categoriaMock]);

    const res = await service.getCategory("GASTO" as any);

    expect(repo.getCategory).toHaveBeenCalledWith("GASTO");
    expect(res).toEqual([categoriaMock]);
  });

  it("getById: si existe => devuelve categoría", async () => {
    repo.getById.mockResolvedValue(categoriaMock);

    const res = await service.getById(1);

    expect(repo.getById).toHaveBeenCalledWith(1);
    expect(res).toEqual(categoriaMock);
  });

  it("getById: si no existe => tira CustomError 404", async () => {
    repo.getById.mockResolvedValue(null);

    await expect(service.getById(999)).rejects.toThrow(
      "Categoría no encontrada",
    );

    try {
      await service.getById(999);
    } catch (e: any) {
      expect(e).toBeInstanceOf(CustomError);
      expect(e.statusCode ?? e.status).toBe(404);
    }
  });
});
