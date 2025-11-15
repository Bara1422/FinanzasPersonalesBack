import { $Enums } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { CategoryRepositoryMock } from "./../../src/repositories/mock/CategoryRepositoryMock";
import { categoriasMock } from "./../../src/repositories/mock/data/categoria.data";

describe("CategoryRepositoryMock", () => {
  let repo: CategoryRepositoryMock;

  beforeEach(() => {
    repo = new CategoryRepositoryMock();
    repo.reset();
  });

  it("debe retornar todas las categorías", async () => {
    const categorias = await repo.getAllCategories();

    expect(categorias.length).toBe(categoriasMock.length);
    expect(categorias).toEqual(categoriasMock);
  });

  it("debe retornar solo categorías de tipo GASTO", async () => {
    const categorias = await repo.getCategory($Enums.TipoCategoria.GASTO);

    expect(categorias.length).toBeGreaterThan(0);
    expect(
      categorias.every((cat) => cat.tipo === $Enums.TipoCategoria.GASTO),
    ).toBe(true);
  });

  it("debe retornar solo categorías de tipo INGRESO", async () => {
    const categorias = await repo.getCategory($Enums.TipoCategoria.INGRESO);

    expect(categorias.length).toBeGreaterThan(0);
    expect(
      categorias.every((cat) => cat.tipo === $Enums.TipoCategoria.INGRESO),
    ).toBe(true);
  });

  it("debe retornar una categoría por ID existente", async () => {
    const id = 1;
    const categoria = await repo.getById(id);

    expect(categoria).not.toBeNull();
    expect(categoria?.id_categoria).toBe(id);
  });

  it("debe retornar null cuando el ID no existe", async () => {
    const categoria = await repo.getById(999);

    expect(categoria).toBeNull();
  });
});
