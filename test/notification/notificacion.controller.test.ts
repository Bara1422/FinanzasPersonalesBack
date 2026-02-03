import type { NextFunction, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificacionController } from "../../src/controllers/notificacion.controller";
import type { AuthRequest } from "../../src/middlewares/auth.middleware";

describe("NotificacionController", () => {
  let service: any;
  let controller: NotificacionController;

  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    service = {
      crearNotificacion: vi.fn(),
      obtenerTodasLasNotificaciones: vi.fn(),
      obtenerNotificacionesUsuario: vi.fn(),
      obtenerNotificacionesPendientesUsuario: vi.fn(),
      obtenerNotificacionesPagadasUsuario: vi.fn(),
      obtenerNotificacionPorId: vi.fn(),
      actualizarNotificacion: vi.fn(),
      eliminarNotificacion: vi.fn(),
      marcarNotificacionComoPagada: vi.fn(),
    };

    controller = new NotificacionController(service);

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

  it("crearNotificacion: si no hay usuario => next con error 401", async () => {
    req.user = undefined;

    await controller.crearNotificacion(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("crearNotificacion: OK => status 201 y json", async () => {
    service.crearNotificacion.mockResolvedValue({ id_notificacion: 1 });

    req.body = { descripcion: "Netflix" };

    await controller.crearNotificacion(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.crearNotificacion).toHaveBeenCalledWith(
      expect.objectContaining({ descripcion: "Netflix", id_usuario: 10 }),
      10,
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id_notificacion: 1 });
    expect(next).not.toHaveBeenCalled();
  });

  it("obtenerTodasLasNotificaciones: OK => devuelve json", async () => {
    service.obtenerTodasLasNotificaciones.mockResolvedValue([
      { id_notificacion: 1 },
    ]);

    await controller.obtenerTodasLasNotificaciones(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.obtenerTodasLasNotificaciones).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ id_notificacion: 1 }]);
    expect(next).not.toHaveBeenCalled();
  });

  it("obtenerNotificacionesPorUsuario: si no hay usuario => next con error", async () => {
    req.user = undefined;

    await controller.obtenerNotificacionesPorUsuario(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("obtenerNotificacionesPorUsuario: OK => llama service con id_usuario", async () => {
    service.obtenerNotificacionesUsuario.mockResolvedValue([
      { id_notificacion: 1 },
    ]);

    await controller.obtenerNotificacionesPorUsuario(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.obtenerNotificacionesUsuario).toHaveBeenCalledWith(10);
    expect(res.json).toHaveBeenCalledWith([{ id_notificacion: 1 }]);
  });

  it("obtenerNotificacionesPendientesPorUsuario: OK => llama service", async () => {
    service.obtenerNotificacionesPendientesUsuario.mockResolvedValue([]);

    await controller.obtenerNotificacionesPendientesPorUsuario(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.obtenerNotificacionesPendientesUsuario).toHaveBeenCalledWith(
      10,
    );
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("obtenerNotificacionesPagadasPorUsuario: OK => llama service", async () => {
    service.obtenerNotificacionesPagadasUsuario.mockResolvedValue([]);

    await controller.obtenerNotificacionesPagadasPorUsuario(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.obtenerNotificacionesPagadasUsuario).toHaveBeenCalledWith(
      10,
    );
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it("obtenerNotificacionPorId: id inválido => next con error 400", async () => {
    req.params = { id: "abc" };

    await controller.obtenerNotificacionPorId(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.obtenerNotificacionPorId).not.toHaveBeenCalled();
  });

  it("obtenerNotificacionPorId: OK => llama service con id y usuario", async () => {
    req.params = { id: "5" };
    service.obtenerNotificacionPorId.mockResolvedValue({ id_notificacion: 5 });

    await controller.obtenerNotificacionPorId(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.obtenerNotificacionPorId).toHaveBeenCalledWith(5, 10);
    expect(res.json).toHaveBeenCalledWith({ id_notificacion: 5 });
  });

  it("actualizarNotificacion: id inválido => next con error 400", async () => {
    req.params = { id: "0" };

    await controller.actualizarNotificacion(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.actualizarNotificacion).not.toHaveBeenCalled();
  });

  it("actualizarNotificacion: OK => llama service y devuelve json", async () => {
    req.params = { id: "3" };
    req.body = { descripcion: "Nueva desc" };

    service.actualizarNotificacion.mockResolvedValue({ id_notificacion: 3 });

    await controller.actualizarNotificacion(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.actualizarNotificacion).toHaveBeenCalledWith(
      3,
      { descripcion: "Nueva desc" },
      10,
    );
    expect(res.json).toHaveBeenCalledWith({ id_notificacion: 3 });
  });

  it("eliminarNotificacion: OK => status 204 y json message", async () => {
    req.params = { id: "7" };
    service.eliminarNotificacion.mockResolvedValue(undefined);

    await controller.eliminarNotificacion(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.eliminarNotificacion).toHaveBeenCalledWith(7, 10);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({
      message: "Notificación eliminada correctamente",
    });
  });

  it("marcarNotificacionComoPagada: id inválido => next con error 400", async () => {
    req.params = { id: "nope" };

    await controller.marcarNotificacionComoPagada(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.marcarNotificacionComoPagada).not.toHaveBeenCalled();
  });

  it("marcarNotificacionComoPagada: OK => llama service y devuelve json", async () => {
    req.params = { id: "2" };
    service.marcarNotificacionComoPagada.mockResolvedValue({
      id_notificacion: 2,
      pagado: true,
    });

    await controller.marcarNotificacionComoPagada(
      req as AuthRequest,
      res as Response,
      next,
    );

    expect(service.marcarNotificacionComoPagada).toHaveBeenCalledWith(2, 10);
    expect(res.json).toHaveBeenCalledWith({ id_notificacion: 2, pagado: true });
  });
});
