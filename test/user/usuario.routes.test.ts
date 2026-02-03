import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// ✅ mock validate
vi.mock("../../src/middlewares/validate-schema.middleware", () => ({
  validate: (_schema: any) => (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../../src/middlewares/user-rol.middleware", () => ({
  isAdmin: (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../../src/services", () => ({
  userService: {
    getAll: vi.fn(),
    findById: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

import userRouter from "../../src/routes/usuario.routes";
import { userService } from "../../src/services";

function makeApp(user: any = { id_usuario: 10, rol: "USER" }) {
  const app = express();
  app.use(express.json());

  app.use((req: any, _res, next) => {
    req.user = user;
    next();
  });

  app.use("/users", userRouter);
  return app;
}

describe("User routes (simple)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /users -> 200 y lista (pasa isAdmin)", async () => {
    vi.mocked(userService.getAll).mockResolvedValue([
      { id_usuario: 1, name: "A" },
    ] as any);

    const res = await request(makeApp({ id_usuario: 1, rol: "ADMIN" })).get(
      "/users",
    );

    expect(res.status).toBe(200);
    expect(userService.getAll).toHaveBeenCalled();
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /users/:id -> 200 y user (dueño)", async () => {
    vi.mocked(userService.findById).mockResolvedValue({
      id_usuario: 10,
      name: "Juan",
    } as any);

    const res = await request(makeApp({ id_usuario: 10, rol: "USER" })).get(
      "/users/10",
    );

    expect(res.status).toBe(200);
    expect(userService.findById).toHaveBeenCalledWith(10);
    expect(res.body).toHaveProperty("id_usuario", 10);
  });

  it("GET /users/:id -> 200 si es ADMIN aunque no sea dueño", async () => {
    vi.mocked(userService.findById).mockResolvedValue({
      id_usuario: 10,
      name: "Juan",
    } as any);

    const res = await request(makeApp({ id_usuario: 1, rol: "ADMIN" })).get(
      "/users/10",
    );

    expect(res.status).toBe(200);
    expect(userService.findById).toHaveBeenCalledWith(10);
  });

  it("PATCH /users/:id -> 200 actualiza (validate pasa)", async () => {
    vi.mocked(userService.update).mockResolvedValue({
      id_usuario: 10,
      name: "Nuevo",
    } as any);

    const res = await request(makeApp({ id_usuario: 10, rol: "USER" }))
      .patch("/users/10")
      .send({ name: "Nuevo" });

    expect(res.status).toBe(200);
    expect(userService.update).toHaveBeenCalledWith(10, { name: "Nuevo" });
    expect(res.body).toHaveProperty("name", "Nuevo");
  });

  it("DELETE /users/:id -> 200 y message", async () => {
    vi.mocked(userService.delete).mockResolvedValue(
      "Usuario eliminado correctamente" as any,
    );

    const res = await request(makeApp({ id_usuario: 10, rol: "USER" })).delete(
      "/users/10",
    );

    expect(res.status).toBe(200);
    expect(userService.delete).toHaveBeenCalledWith(10);
    expect(res.body).toHaveProperty(
      "message",
      "Usuario eliminado correctamente",
    );
  });
});
