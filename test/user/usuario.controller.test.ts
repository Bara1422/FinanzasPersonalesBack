import type { NextFunction, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserController } from "../../src/controllers/usuario.controller";
import type { AuthRequest } from "../../src/middlewares/auth.middleware";

describe("UserController", () => {
  let service: any;
  let controller: UserController;

  let req: Partial<AuthRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    vi.clearAllMocks();

    service = {
      getAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    controller = new UserController(service);

    req = {
      params: {},
      body: {},
      user: { id_usuario: 10, rol: "USER" } as any,
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  it("getAll: OK => 200 y lista", async () => {
    service.getAll.mockResolvedValue([{ id_usuario: 1 }]);

    await controller.getAll(req as AuthRequest, res as Response, next);

    expect(service.getAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ id_usuario: 1 }]);
    expect(next).not.toHaveBeenCalled();
  });

  it("getById: sin usuario => next(error)", async () => {
    req.user = undefined;
    req.params = { id: "10" };

    await controller.getById(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.findById).not.toHaveBeenCalled();
  });

  it("getById: id inválido => next(error)", async () => {
    req.params = { id: "abc" };

    await controller.getById(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.findById).not.toHaveBeenCalled();
  });

  it("getById: no dueño y no admin => next(error) 403", async () => {
    req.user = { id_usuario: 10, rol: "USER" } as any;
    req.params = { id: "99" };

    await controller.getById(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.findById).not.toHaveBeenCalled();
  });

  it("getById: dueño => 200 y json", async () => {
    req.user = { id_usuario: 10, rol: "USER" } as any;
    req.params = { id: "10" };
    service.findById.mockResolvedValue({ id_usuario: 10, name: "Juan" });

    await controller.getById(req as AuthRequest, res as Response, next);

    expect(service.findById).toHaveBeenCalledWith(10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id_usuario: 10, name: "Juan" });
  });

  it("getById: admin puede ver a otro => 200", async () => {
    req.user = { id_usuario: 1, rol: "ADMIN" } as any;
    req.params = { id: "10" };
    service.findById.mockResolvedValue({ id_usuario: 10, name: "Juan" });

    await controller.getById(req as AuthRequest, res as Response, next);

    expect(service.findById).toHaveBeenCalledWith(10);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("update: sin usuario => next(error)", async () => {
    req.user = undefined;
    req.params = { id: "10" };

    await controller.update(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.update).not.toHaveBeenCalled();
  });

  it("update: no dueño y no admin => next(error) 403", async () => {
    req.user = { id_usuario: 10, rol: "USER" } as any;
    req.params = { id: "99" };

    await controller.update(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.update).not.toHaveBeenCalled();
  });

  it("update: id inválido => next(error) 400", async () => {
    req.user = { id_usuario: 10, rol: "USER" } as any;
    req.params = { id: "0" };

    await controller.update(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.update).not.toHaveBeenCalled();
  });

  it("update: dueño => 200 y json", async () => {
    req.user = { id_usuario: 10, rol: "USER" } as any;
    req.params = { id: "10" };
    req.body = { name: "Nuevo" };
    service.update.mockResolvedValue({ id_usuario: 10, name: "Nuevo" });

    await controller.update(req as AuthRequest, res as Response, next);

    expect(service.update).toHaveBeenCalledWith(10, { name: "Nuevo" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id_usuario: 10, name: "Nuevo" });
  });

  it("update: admin puede actualizar a otro => 200", async () => {
    req.user = { id_usuario: 1, rol: "ADMIN" } as any;
    req.params = { id: "10" };
    req.body = { name: "AdminUpdate" };
    service.update.mockResolvedValue({ id_usuario: 10, name: "AdminUpdate" });

    await controller.update(req as AuthRequest, res as Response, next);

    expect(service.update).toHaveBeenCalledWith(10, { name: "AdminUpdate" });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("delete: id inválido => next(error) 400", async () => {
    req.params = { id: "abc" };

    await controller.delete(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.delete).not.toHaveBeenCalled();
  });

  it("delete: sin usuario => next(error) 401", async () => {
    req.user = undefined;
    req.params = { id: "10" };

    await controller.delete(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.delete).not.toHaveBeenCalled();
  });

  it("delete: no dueño y no admin => next(error) 403", async () => {
    req.user = { id_usuario: 10, rol: "USER" } as any;
    req.params = { id: "99" };

    await controller.delete(req as AuthRequest, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(service.delete).not.toHaveBeenCalled();
  });

  it("delete: dueño => 200 y message", async () => {
    req.user = { id_usuario: 10, rol: "USER" } as any;
    req.params = { id: "10" };
    service.delete.mockResolvedValue("Usuario eliminado correctamente");

    await controller.delete(req as AuthRequest, res as Response, next);

    expect(service.delete).toHaveBeenCalledWith(10);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Usuario eliminado correctamente",
    });
  });

  it("delete: admin puede eliminar a otro => 200", async () => {
    req.user = { id_usuario: 1, rol: "ADMIN" } as any;
    req.params = { id: "10" };
    service.delete.mockResolvedValue("Usuario eliminado correctamente");

    await controller.delete(req as AuthRequest, res as Response, next);

    expect(service.delete).toHaveBeenCalledWith(10);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
