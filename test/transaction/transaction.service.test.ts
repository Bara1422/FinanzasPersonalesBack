import type { Categoria, Transaccion } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TransaccionService } from "../../src/services/transaccion.service"; // ajustá
import { CustomError } from "../../src/utils/CustomError"; // ajustá

// ✅ mock del dto para comparar fácil
vi.mock("../../src/dtos/transaccion.dto", () => ({
  toTransaccionDTO: (t: any) => ({
    id_transaccion: t.id_transaccion,
    id_usuario: t.id_usuario,
    id_categoria: t.id_categoria,
    monto: t.monto,
    descripcion: t.descripcion,
  }),
}));

describe("TransaccionService", () => {
  let transaccionRepo: any;
  let categoriaRepo: any;
  let service: TransaccionService;

  const baseTx: Transaccion = {
    id_transaccion: 1,
    id_usuario: 10,
    id_categoria: 1,
    monto: 1000,
    descripcion: "Comida",
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    transaccionRepo = {
      create: vi.fn(),
      findAll: vi.fn(),
      findByUserId: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      getResumen: vi.fn(),
    };

    categoriaRepo = {
      getById: vi.fn(),
    };

    service = new TransaccionService(transaccionRepo, categoriaRepo);
  });

  it("crearTransaccion: si categoría no existe => 400", async () => {
    categoriaRepo.getById.mockResolvedValue(null);

    await expect(
      service.crearTransaccion({ id_categoria: 999 } as any, 10),
    ).rejects.toThrow("La categoría especificada no existe");

    expect(transaccionRepo.create).not.toHaveBeenCalled();
  });

  it("crearTransaccion: OK => llama create y devuelve DTO", async () => {
    categoriaRepo.getById.mockResolvedValue({ id_categoria: 1 } as Categoria);
    transaccionRepo.create.mockResolvedValue(baseTx);

    const res = await service.crearTransaccion(
      { id_categoria: 1, monto: 1000, descripcion: "Comida" } as any,
      10,
    );

    expect(transaccionRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ id_categoria: 1 }),
      10,
    );
    expect(res).toMatchObject({
      id_transaccion: 1,
      id_usuario: 10,
      id_categoria: 1,
      monto: 1000,
      descripcion: "Comida",
    });
  });

  it("obtenerTodasLasTransacciones: devuelve lista DTO", async () => {
    transaccionRepo.findAll.mockResolvedValue([baseTx]);

    const res = await service.obtenerTodasLasTransacciones();

    expect(transaccionRepo.findAll).toHaveBeenCalled();
    expect(res).toEqual([
      {
        id_transaccion: 1,
        id_usuario: 10,
        id_categoria: 1,
        monto: 1000,
        descripcion: "Comida",
      },
    ]);
  });

  it("obtenerTransaccionesUsuario: llama findByUserId", async () => {
    transaccionRepo.findByUserId.mockResolvedValue([baseTx]);

    const res = await service.obtenerTransaccionesUsuario(10);

    expect(transaccionRepo.findByUserId).toHaveBeenCalledWith(10);
    expect(res.length).toBe(1);
  });

  it("obtenerTransaccionPorId: si no existe => 404", async () => {
    transaccionRepo.findById.mockResolvedValue(null);

    await expect(service.obtenerTransaccionPorId(1, 10)).rejects.toThrow(
      "Transacción no encontrada",
    );

    try {
      await service.obtenerTransaccionPorId(1, 10);
    } catch (e: any) {
      expect(e).toBeInstanceOf(CustomError);
      expect(e.statusCode ?? e.status).toBe(404);
    }
  });

  it("obtenerTransaccionPorId: si no es dueño => 403", async () => {
    transaccionRepo.findById.mockResolvedValue({ ...baseTx, id_usuario: 999 });

    await expect(service.obtenerTransaccionPorId(1, 10)).rejects.toThrow(
      "No tienes permiso para ver esta transacción",
    );
  });

  it("obtenerTransaccionPorId: OK => devuelve DTO", async () => {
    transaccionRepo.findById.mockResolvedValue(baseTx);

    const res = await service.obtenerTransaccionPorId(1, 10);

    expect(res).toMatchObject({ id_transaccion: 1, id_usuario: 10 });
  });

  it("actualizarTransaccion: si no existe => 404", async () => {
    transaccionRepo.findById.mockResolvedValue(null);

    await expect(
      service.actualizarTransaccion(1, { descripcion: "x" } as any, 10),
    ).rejects.toThrow("Transacción no encontrada");
  });

  it("actualizarTransaccion: si no es dueño => 403", async () => {
    transaccionRepo.findById.mockResolvedValue({ ...baseTx, id_usuario: 999 });

    await expect(
      service.actualizarTransaccion(1, { descripcion: "x" } as any, 10),
    ).rejects.toThrow("No tienes permiso para actualizar esta transacción");
  });

  it("actualizarTransaccion: si cambia categoría y no existe => 400", async () => {
    transaccionRepo.findById.mockResolvedValue(baseTx);
    categoriaRepo.getById.mockResolvedValue(null);

    await expect(
      service.actualizarTransaccion(1, { id_categoria: 999 } as any, 10),
    ).rejects.toThrow("La categoría especificada no existe");

    expect(transaccionRepo.update).not.toHaveBeenCalled();
  });

  it("actualizarTransaccion: OK => llama update y devuelve DTO", async () => {
    transaccionRepo.findById.mockResolvedValue(baseTx);
    categoriaRepo.getById.mockResolvedValue({ id_categoria: 1 } as Categoria);
    transaccionRepo.update.mockResolvedValue({
      ...baseTx,
      descripcion: "Nueva",
    });

    const res = await service.actualizarTransaccion(
      1,
      { descripcion: "Nueva" } as any,
      10,
    );

    expect(transaccionRepo.update).toHaveBeenCalledWith(1, {
      descripcion: "Nueva",
    });
    expect(res).toMatchObject({ id_transaccion: 1, descripcion: "Nueva" });
  });

  it("eliminarTransaccion: si no existe => 404", async () => {
    transaccionRepo.findById.mockResolvedValue(null);

    await expect(service.eliminarTransaccion(1, 10)).rejects.toThrow(
      "Transacción no encontrada",
    );
  });

  it("eliminarTransaccion: si no es dueño => 403", async () => {
    transaccionRepo.findById.mockResolvedValue({ ...baseTx, id_usuario: 999 });

    await expect(service.eliminarTransaccion(1, 10)).rejects.toThrow(
      "No tienes permiso para eliminar esta transacción",
    );
  });

  it("eliminarTransaccion: OK => llama delete", async () => {
    transaccionRepo.findById.mockResolvedValue(baseTx);
    transaccionRepo.delete.mockResolvedValue("ok");

    const res = await service.eliminarTransaccion(1, 10);

    expect(transaccionRepo.delete).toHaveBeenCalledWith(1);
    expect(res).toBe("ok");
  });

  it("obtenerResumenFinanciero: llama getResumen", async () => {
    transaccionRepo.getResumen.mockResolvedValue({
      totalIngresos: 1000,
      totalGastos: 500,
      balance: 500,
    });

    const res = await service.obtenerResumenFinanciero(10);

    expect(transaccionRepo.getResumen).toHaveBeenCalledWith(10);
    expect(res).toMatchObject({ balance: 500 });
  });
});
