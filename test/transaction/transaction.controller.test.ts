import type { NextFunction, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TransaccionController } from "../../src/controllers/transaccion.controller"; // ajustá
import type { AuthRequest } from "../../src/middlewares/auth.middleware"; // ajustá

describe("TransaccionController", () => {
  let service: any;
  let controller: TransaccionController;

  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    service = {
      crearTransaccion: vi.fn(),
      obtenerTodasLasTransacciones: vi.fn(),
      obtenerTransaccionesUsuario: vi.fn(),
      obtenerResumenFinanciero: vi.fn(),
      obtenerTransaccionPorId: vi.fn(),
      actualizarTransaccion: vi.fn(),
      eliminarTransaccion: vi.fn(),
    };

    controller = new TransaccionController(service);

    req = {
      body: {},
      params: {},
      user: { id_usuario: 10, rol: "USER" } as any,
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  it("crearTransaccion: sin usuario => next(error)", async () => {
    req.user = undefined;

    await controller.crearTransaccion(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.crearTransaccion).not.toHaveBeenCalled();
  });

  it("crearTransaccion: OK => 201 y json", async () => {
    req.body = { id_categoria: 1, monto: 1000, descripcion: "Comida" };
    service.crearTransaccion.mockResolvedValue({ id_transaccion: 1 });

    await controller.crearTransaccion(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.crearTransaccion).toHaveBeenCalledWith(
      expect.objectContaining({
        id_categoria: 1,
        monto: 1000,
        descripcion: "Comida",
        id_usuario: 10,
      }),
      10,
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id_transaccion: 1 });
  });

  it("obtenerTodasLasTransacciones: OK => json", async () => {
    service.obtenerTodasLasTransacciones.mockResolvedValue([
      { id_transaccion: 1 },
    ]);

    await controller.obtenerTodasLasTransacciones(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.obtenerTodasLasTransacciones).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ id_transaccion: 1 }]);
    expect(next).not.toHaveBeenCalled();
  });

  it("obtenerTransaccionesPorUsuario: sin usuario => next(error)", async () => {
    req.user = undefined;

    await controller.obtenerTransaccionesPorUsuario(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.obtenerTransaccionesUsuario).not.toHaveBeenCalled();
  });

  it("obtenerTransaccionesPorUsuario: OK => llama service con id_usuario", async () => {
    service.obtenerTransaccionesUsuario.mockResolvedValue([
      { id_transaccion: 1 },
    ]);

    await controller.obtenerTransaccionesPorUsuario(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.obtenerTransaccionesUsuario).toHaveBeenCalledWith(10);
    expect(res.json).toHaveBeenCalledWith([{ id_transaccion: 1 }]);
  });

  it("obtenerResumen: sin usuario => next(error)", async () => {
    req.user = undefined;

    await controller.obtenerResumen(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.obtenerResumenFinanciero).not.toHaveBeenCalled();
  });

  it("obtenerResumen: OK => llama service y json", async () => {
    service.obtenerResumenFinanciero.mockResolvedValue({ balance: 500 });

    await controller.obtenerResumen(req as AuthRequest, res as Response, next);

    expect(service.obtenerResumenFinanciero).toHaveBeenCalledWith(10);
    expect(res.json).toHaveBeenCalledWith({ balance: 500 });
  });

  it("obtenerTransaccionPorId: id inválido => next(error)", async () => {
    req.params = { id: "abc" };

    await controller.obtenerTransaccionPorId(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.obtenerTransaccionPorId).not.toHaveBeenCalled();
  });

  it("obtenerTransaccionPorId: OK => llama service con id + usuario", async () => {
    req.params = { id: "7" };
    service.obtenerTransaccionPorId.mockResolvedValue({ id_transaccion: 7 });

    await controller.obtenerTransaccionPorId(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.obtenerTransaccionPorId).toHaveBeenCalledWith(7, 10);
    expect(res.json).toHaveBeenCalledWith({ id_transaccion: 7 });
  });

  it("actualizarTransaccion: id inválido => next(error)", async () => {
    req.params = { id: "0" };

    await controller.actualizarTransaccion(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.actualizarTransaccion).not.toHaveBeenCalled();
  });

  it("actualizarTransaccion: OK => llama service y json", async () => {
    req.params = { id: "3" };
    req.body = { descripcion: "Nueva" };
    service.actualizarTransaccion.mockResolvedValue({
      id_transaccion: 3,
      descripcion: "Nueva",
    });

    await controller.actualizarTransaccion(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.actualizarTransaccion).toHaveBeenCalledWith(
      3,
      { descripcion: "Nueva" },
      10,
    );
    expect(res.json).toHaveBeenCalledWith({
      id_transaccion: 3,
      descripcion: "Nueva",
    });
  });

  // ---------- eliminarTransaccion ----------
  it("eliminarTransaccion: id inválido => next(error)", async () => {
    req.params = { id: "nope" };

    await controller.eliminarTransaccion(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.eliminarTransaccion).not.toHaveBeenCalled();
  });

  it("eliminarTransaccion: OK => llama service y json message", async () => {
    req.params = { id: "5" };
    service.eliminarTransaccion.mockResolvedValue("ok");

    await controller.eliminarTransaccion(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.eliminarTransaccion).toHaveBeenCalledWith(5, 10);
    expect(res.json).toHaveBeenCalledWith({ message: "ok" });
  });
});
