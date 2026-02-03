import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CategoryController } from "../../src/controllers/categorias.controller";

describe("CategoryController", () => {
  let service: any;
  let controller: CategoryController;

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    service = {
      getAllCategories: vi.fn(),
      getCategory: vi.fn(),
      getById: vi.fn(),
    };

    controller = new CategoryController(service);

    req = { params: {} };
    res = { json: vi.fn() };
    next = vi.fn();
  });

  it("getAllCategories: devuelve todas", async () => {
    service.getAllCategories.mockResolvedValue([{ id_categoria: 1 }]);

    await controller.getAllCategories(req as Request, res as Response, next);

    expect(service.getAllCategories).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ id_categoria: 1 }]);
    expect(next).not.toHaveBeenCalled();
  });

  it("getCategoriesByType: si tipo es inválido => next(error)", async () => {
    req.params = { tipo: "otro" };

    await controller.getCategoriesByType(req as Request, res as Response, next);

    expect(service.getCategory).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("getCategoriesByType: si tipo es INGRESO => llama service", async () => {
    req.params = { tipo: "ingreso" };
    service.getCategory.mockResolvedValue([{ tipo: "INGRESO" }]);

    await controller.getCategoriesByType(req as Request, res as Response, next);

    expect(service.getCategory).toHaveBeenCalledWith("INGRESO");
    expect(res.json).toHaveBeenCalledWith([{ tipo: "INGRESO" }]);
    expect(next).not.toHaveBeenCalled();
  });

  it("getCategoriesByType: si tipo es GASTO => llama service", async () => {
    req.params = { tipo: "GASTO" };
    service.getCategory.mockResolvedValue([{ tipo: "GASTO" }]);

    await controller.getCategoriesByType(req as Request, res as Response, next);

    expect(service.getCategory).toHaveBeenCalledWith("GASTO");
    expect(res.json).toHaveBeenCalledWith([{ tipo: "GASTO" }]);
    expect(next).not.toHaveBeenCalled();
  });

  it("getCategoryById: id inválido => next(error)", async () => {
    req.params = { id_categoria: "abc" };

    await controller.getCategoryById(req as Request, res as Response, next);

    expect(service.getById).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("getCategoryById: OK => llama service y devuelve json", async () => {
    req.params = { id_categoria: "3" };
    service.getById.mockResolvedValue({ id_categoria: 3, nombre: "Comida" });

    await controller.getCategoryById(req as Request, res as Response, next);

    expect(service.getById).toHaveBeenCalledWith(3);
    expect(res.json).toHaveBeenCalledWith({
      id_categoria: 3,
      nombre: "Comida",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
