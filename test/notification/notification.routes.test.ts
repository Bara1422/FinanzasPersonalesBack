import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/middlewares/validate-schema.middleware", () => ({
  validate: (_schema: any) => (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../../src/middlewares/user-rol.middleware", () => ({
  isAdmin: (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../../src/services", () => ({
  notificacionService: {
    crearNotificacion: vi.fn(),
    obtenerTodasLasNotificaciones: vi.fn(),
    obtenerNotificacionesUsuario: vi.fn(),
    obtenerNotificacionesPendientesUsuario: vi.fn(),
    obtenerNotificacionesPagadasUsuario: vi.fn(),
    obtenerNotificacionPorId: vi.fn(),
    actualizarNotificacion: vi.fn(),
    eliminarNotificacion: vi.fn(),
    marcarNotificacionComoPagada: vi.fn(),
  },
}));

import notificacionRouter from "../../src/routes/notificacion.routes";
import { notificacionService } from "../../src/services";

function makeApp() {
  const app = express();
  app.use(express.json());

  app.use((req: any, _res, next) => {
    req.user = { id_usuario: 10, rol: "USER" };
    next();
  });

  app.use("/notificaciones", notificacionRouter);
  return app;
}

describe("Notificacion routes (simple)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /notificaciones/admin/all -> 200 y lista", async () => {
    vi.mocked(
      notificacionService.obtenerTodasLasNotificaciones,
    ).mockResolvedValue([{ id_notificacion: 1 }] as any);

    const res = await request(makeApp()).get("/notificaciones/admin/all");

    expect(res.status).toBe(200);
    expect(
      notificacionService.obtenerTodasLasNotificaciones,
    ).toHaveBeenCalled();
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /notificaciones -> 201 crea notificación", async () => {
    vi.mocked(notificacionService.crearNotificacion).mockResolvedValue({
      id_notificacion: 1,
    } as any);

    const res = await request(makeApp())
      .post("/notificaciones")
      .send({
        id_categoria: 1,
        descripcion: "Netflix",
        monto: 1000,
        prioridad: "MEDIA",
        fecha_vencimiento: new Date(Date.now() + 1000 * 60).toISOString(),
      });

    expect(res.status).toBe(201);
    expect(notificacionService.crearNotificacion).toHaveBeenCalled();
    expect(res.body).toHaveProperty("id_notificacion", 1);
  });

  it("GET /notificaciones -> 200 devuelve por usuario", async () => {
    vi.mocked(
      notificacionService.obtenerNotificacionesUsuario,
    ).mockResolvedValue([{ id_notificacion: 1, id_usuario: 10 }] as any);

    const res = await request(makeApp()).get("/notificaciones");

    expect(res.status).toBe(200);
    expect(
      notificacionService.obtenerNotificacionesUsuario,
    ).toHaveBeenCalledWith(10);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /notificaciones/pending -> 200 devuelve pendientes", async () => {
    vi.mocked(
      notificacionService.obtenerNotificacionesPendientesUsuario,
    ).mockResolvedValue([{ id_notificacion: 2, pagado: false }] as any);

    const res = await request(makeApp()).get("/notificaciones/pending");

    expect(res.status).toBe(200);
    expect(
      notificacionService.obtenerNotificacionesPendientesUsuario,
    ).toHaveBeenCalledWith(10);
  });

  it("GET /notificaciones/paid -> 200 devuelve pagadas", async () => {
    vi.mocked(
      notificacionService.obtenerNotificacionesPagadasUsuario,
    ).mockResolvedValue([{ id_notificacion: 3, pagado: true }] as any);

    const res = await request(makeApp()).get("/notificaciones/paid");

    expect(res.status).toBe(200);
    expect(
      notificacionService.obtenerNotificacionesPagadasUsuario,
    ).toHaveBeenCalledWith(10);
  });

  it("GET /notificaciones/:id -> 200 devuelve una", async () => {
    vi.mocked(notificacionService.obtenerNotificacionPorId).mockResolvedValue({
      id_notificacion: 5,
    } as any);

    const res = await request(makeApp()).get("/notificaciones/5");

    expect(res.status).toBe(200);
    expect(notificacionService.obtenerNotificacionPorId).toHaveBeenCalledWith(
      5,
      10,
    );
    expect(res.body).toHaveProperty("id_notificacion", 5);
  });

  it("PATCH /notificaciones/:id -> 200 actualiza", async () => {
    vi.mocked(notificacionService.actualizarNotificacion).mockResolvedValue({
      id_notificacion: 7,
      descripcion: "Actualizada",
    } as any);

    const res = await request(makeApp())
      .patch("/notificaciones/7")
      .send({ descripcion: "Actualizada" });

    expect(res.status).toBe(200);
    expect(notificacionService.actualizarNotificacion).toHaveBeenCalledWith(
      7,
      { descripcion: "Actualizada" },
      10,
    );
  });

  it("DELETE /notificaciones/:id -> 204", async () => {
    vi.mocked(notificacionService.eliminarNotificacion).mockResolvedValue(
      "Notificación eliminada correctamente" as any,
    );

    const res = await request(makeApp()).delete("/notificaciones/9");

    expect(res.status).toBe(204);
    expect(notificacionService.eliminarNotificacion).toHaveBeenCalledWith(
      9,
      10,
    );
  });

  it("POST /notificaciones/:id/pagar -> 200", async () => {
    vi.mocked(
      notificacionService.marcarNotificacionComoPagada,
    ).mockResolvedValue({
      id_notificacion: 11,
      pagado: true,
    } as any);

    const res = await request(makeApp()).post("/notificaciones/11/pagar");

    expect(res.status).toBe(200);
    expect(
      notificacionService.marcarNotificacionComoPagada,
    ).toHaveBeenCalledWith(11, 10);
    expect(res.body).toMatchObject({ id_notificacion: 11, pagado: true });
  });
});
