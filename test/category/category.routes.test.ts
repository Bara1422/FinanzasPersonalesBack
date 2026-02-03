import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/services", () => ({
  categoryService: {
    getAllCategories: vi.fn(),
    getCategory: vi.fn(),
    getById: vi.fn(),
  },
}));

import categoryRouter from "../../src/routes/category.routes";
import { categoryService } from "../../src/services";

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/categorias", categoryRouter);
  return app;
}

describe("Category routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /categorias -> 200 y lista", async () => {
    vi.mocked(categoryService.getAllCategories).mockResolvedValue([
      { id_categoria: 1, nombre: "Comida", tipo: "GASTO" },
    ] as any);

    const res = await request(makeApp()).get("/categorias");

    expect(res.status).toBe(200);
    expect(categoryService.getAllCategories).toHaveBeenCalled();
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /categorias/gasto -> 200 y llama getCategory con GASTO", async () => {
    vi.mocked(categoryService.getCategory).mockResolvedValue([
      { id_categoria: 2, nombre: "Alquiler", tipo: "GASTO" },
    ] as any);

    const res = await request(makeApp()).get("/categorias/gasto");

    expect(res.status).toBe(200);
    expect(categoryService.getCategory).toHaveBeenCalledWith("GASTO");
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /categorias/ingreso -> 200 y llama getCategory con INGRESO", async () => {
    vi.mocked(categoryService.getCategory).mockResolvedValue([
      { id_categoria: 3, nombre: "Sueldo", tipo: "INGRESO" },
    ] as any);

    const res = await request(makeApp()).get("/categorias/ingreso");

    expect(res.status).toBe(200);
    expect(categoryService.getCategory).toHaveBeenCalledWith("INGRESO");
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /categorias/id/1 -> 200 y llama getById", async () => {
    vi.mocked(categoryService.getById).mockResolvedValue({
      id_categoria: 1,
      nombre: "Comida",
      tipo: "GASTO",
    } as any);

    const res = await request(makeApp()).get("/categorias/id/1");

    expect(res.status).toBe(200);
    expect(categoryService.getById).toHaveBeenCalledWith(1);
    expect(res.body).toHaveProperty("id_categoria", 1);
  });
});
