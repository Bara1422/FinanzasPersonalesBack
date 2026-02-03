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
  transaccionService: {
    crearTransaccion: vi.fn(),
    obtenerTodasLasTransacciones: vi.fn(),
    obtenerTransaccionesUsuario: vi.fn(),
    obtenerResumenFinanciero: vi.fn(),
    obtenerTransaccionPorId: vi.fn(),
    actualizarTransaccion: vi.fn(),
    eliminarTransaccion: vi.fn(),
  },
}));

import transaccionRouter from "../../src/routes/transaccion.routes";
import { transaccionService } from "../../src/services";

function makeApp(user: any = { id_usuario: 10, rol: "USER" }) {
  const app = express();
  app.use(express.json());

  app.use((req: any, _res, next) => {
    req.user = user;
    next();
  });

  app.use("/transacciones", transaccionRouter);
  return app;
}

describe("Transaccion routes (simple)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /transacciones/admin/all -> 200 y lista", async () => {
    vi.mocked(
      transaccionService.obtenerTodasLasTransacciones,
    ).mockResolvedValue([{ id_transaccion: 1 }] as any);

    const res = await request(makeApp({ id_usuario: 1, rol: "ADMIN" })).get(
      "/transacciones/admin/all",
    );

    expect(res.status).toBe(200);
    expect(transaccionService.obtenerTodasLasTransacciones).toHaveBeenCalled();
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /transacciones -> 201 crea transacción", async () => {
    vi.mocked(transaccionService.crearTransaccion).mockResolvedValue({
      id_transaccion: 1,
    } as any);

    const res = await request(makeApp()).post("/transacciones").send({
      id_categoria: 1,
      monto: 1000,
      descripcion: "Comida",
    });

    expect(res.status).toBe(201);
    expect(transaccionService.crearTransaccion).toHaveBeenCalled();
    expect(res.body).toHaveProperty("id_transaccion", 1);
  });

  it("GET /transacciones -> 200 devuelve por usuario", async () => {
    vi.mocked(transaccionService.obtenerTransaccionesUsuario).mockResolvedValue(
      [{ id_transaccion: 1, id_usuario: 10 }] as any,
    );

    const res = await request(makeApp()).get("/transacciones");

    expect(res.status).toBe(200);
    expect(transaccionService.obtenerTransaccionesUsuario).toHaveBeenCalledWith(
      10,
    );
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /transacciones/resumen -> 200 devuelve resumen", async () => {
    vi.mocked(transaccionService.obtenerResumenFinanciero).mockResolvedValue({
      balance: 500,
    } as any);

    const res = await request(makeApp()).get("/transacciones/resumen");

    expect(res.status).toBe(200);
    expect(transaccionService.obtenerResumenFinanciero).toHaveBeenCalledWith(
      10,
    );
    expect(res.body).toHaveProperty("balance", 500);
  });

  it("GET /transacciones/:id -> 200 devuelve una transacción", async () => {
    vi.mocked(transaccionService.obtenerTransaccionPorId).mockResolvedValue({
      id_transaccion: 7,
    } as any);

    const res = await request(makeApp()).get("/transacciones/7");

    expect(res.status).toBe(200);
    expect(transaccionService.obtenerTransaccionPorId).toHaveBeenCalledWith(
      7,
      10,
    );
    expect(res.body).toHaveProperty("id_transaccion", 7);
  });

  it("PATCH /transacciones/:id -> 200 actualiza", async () => {
    vi.mocked(transaccionService.actualizarTransaccion).mockResolvedValue({
      id_transaccion: 3,
      descripcion: "Nueva",
    } as any);

    const res = await request(makeApp())
      .patch("/transacciones/3")
      .send({ descripcion: "Nueva" });

    expect(res.status).toBe(200);
    expect(transaccionService.actualizarTransaccion).toHaveBeenCalledWith(
      3,
      { descripcion: "Nueva" },
      10,
    );
    expect(res.body).toHaveProperty("descripcion", "Nueva");
  });

  it("DELETE /transacciones/:id -> 200 message", async () => {
    vi.mocked(transaccionService.eliminarTransaccion).mockResolvedValue(
      "Transacción eliminada correctamente" as any,
    );

    const res = await request(makeApp()).delete("/transacciones/9");

    expect(res.status).toBe(200);
    expect(transaccionService.eliminarTransaccion).toHaveBeenCalledWith(9, 10);
    expect(res.body).toHaveProperty("message");
  });
});
