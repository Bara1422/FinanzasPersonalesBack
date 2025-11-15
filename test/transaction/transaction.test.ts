import { describe, it, expect, beforeEach } from "vitest";
import { TransaccionRepositoryMock } from "../../src/repositories/mock/TransaccionRepositoryMock";

import { transaccionesMock } from "../../src/repositories/mock/data/transaccion.data";
import { categoriasMock } from "../../src/repositories/mock/data/categoria.data";

describe("TransaccionRepositoryMock (Vitest)", () => {
  let repo: TransaccionRepositoryMock;

  beforeEach(() => {
    repo = new TransaccionRepositoryMock();
  });

  it("findAll debe devolver todas las transacciones del mock real", async () => {
    const transacciones = await repo.findAll();
    expect(transacciones.length).toBe(transaccionesMock.length);
  });

  it("findById debe encontrar por ID", async () => {
    const t = await repo.findById(1);

    expect(t).not.toBeNull();
    expect(t?.id_transaccion).toBe(1);
    expect(t?.descripcion).toBe("Compra de alimentos");
  });

  it("findById debe devolver null cuando no existe", async () => {
    const t = await repo.findById(99999);
    expect(t).toBeNull();
  });

  it("findByUserId debe devolver solo transacciones del usuario 1", async () => {
    const transacciones = await repo.findByUserId(1);

    expect(transacciones.length).toBe(3);
    expect(transacciones.every((t) => t.id_usuario === 1)).toBe(true);
  });

  it("create debe crear una nueva transacción válida", async () => {
    const nueva = await repo.create(
      {
        id_categoria: 1,
        monto: 1500,
        descripcion: "Nueva prueba",
      },
      1
    );

    expect(nueva.id_transaccion).toBeDefined();
    expect(nueva.monto).toBe(1500);

    const all = await repo.findAll();
    expect(all.length).toBe(transaccionesMock.length );
  });

  it("update debe modificar una transacción existente", async () => {
    const updated = await repo.update(1, { monto: 99999 });

    expect(updated.monto).toBe(99999);

    const t = await repo.findById(1);
    expect(t?.monto).toBe(99999);
  });

  it("update debe lanzar error si la transacción no existe", async () => {
    await expect(() => repo.update(999, { monto: 100 }))
      .rejects
      .toThrow("Transacción no encontrada");
  });

  it("delete debe eliminar la transacción correctamente", async () => {
    await repo.delete(1);

    const t = await repo.findById(1);
    expect(t).toBeNull();

    const all = await repo.findAll();
    expect(all.length).toBe(transaccionesMock.length - 1);
  });

  it("getResumen debe devolver un resumen estructurado correctamente", async () => {
    const resumen = await repo.getResumen(1);

    expect(resumen).toHaveProperty("transacciones");
    expect(resumen).toHaveProperty("resumenMensual");
    expect(resumen).toHaveProperty("resumenTotal");
    expect(resumen).toHaveProperty("cantidadTransacciones");

    expect(Array.isArray(resumen.transacciones)).toBe(true);

    // Validación estructura: ingresos, gastos y balance siempre deben ser number
    expect(typeof resumen.resumenMensual.ingresos).toBe("number");
    expect(typeof resumen.resumenMensual.gastos).toBe("number");
    expect(typeof resumen.resumenMensual.balance).toBe("number");

    expect(typeof resumen.resumenTotal.ingresos).toBe("number");
    expect(typeof resumen.resumenTotal.gastos).toBe("number");
    expect(typeof resumen.resumenTotal.balance).toBe("number");
  });
});
