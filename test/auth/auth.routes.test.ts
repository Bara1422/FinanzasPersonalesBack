import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/middlewares/rate-limit.middleware", () => ({
  authLimiter: (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../../src/middlewares/validate-schema.middleware", () => ({
  validate: (_schema: any) => (_req: any, _res: any, next: any) => next(),
}));

vi.mock("../../src/middlewares/auth.middleware", () => ({
  authMiddleware: (req: any, _res: any, next: any) => {
    req.user = { id_usuario: 10, rol: "USER" };
    next();
  },
}));

vi.mock("../../src/services", () => ({
  authService: {
    registerUsuario: vi.fn(),
    login: vi.fn(),
    sendResetToken: vi.fn(),
    resetPassword: vi.fn(),
    verifyToken: vi.fn(),
  },
  userService: {
    getById: vi.fn(),
    findById: vi.fn(),
    obtenerUsuarioPorId: vi.fn(),
    getUserById: vi.fn(),
  },
}));

import authRouter from "../../src/routes/auth.routes";
import { authService, userService } from "../../src/services";

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use("/auth", authRouter);
  return app;
}

describe("Auth routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /auth/register -> devuelve usuario + token", async () => {
    vi.mocked(authService.registerUsuario).mockResolvedValue({
      usuario: {
        id_usuario: 10,
        email: "juan@test.com",
        username: "juan",
        rol: "USER",
      },
      token: "token_mock",
    } as any);

    const res = await request(makeApp()).post("/auth/register").send({
      name: "Juan",
      email: "juan@test.com",
      username: "juan",
      password: "123456",
    });

    expect([200, 201]).toContain(res.status);
    expect(authService.registerUsuario).toHaveBeenCalled();
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("usuario");
  });

  it("POST /auth/login -> devuelve usuario + token", async () => {
    vi.mocked(authService.login).mockResolvedValue({
      usuario: {
        id_usuario: 10,
        email: "juan@test.com",
        username: "juan",
        rol: "USER",
      },
      token: "token_mock",
    } as any);

    const res = await request(makeApp()).post("/auth/login").send({
      email: "juan@test.com",
      password: "123456",
    });

    expect(res.status).toBe(200);
    expect(authService.login).toHaveBeenCalled();
    expect(res.body).toHaveProperty("token");
  });

  it("POST /auth/forgot-password -> devuelve message", async () => {
    vi.mocked(authService.sendResetToken).mockResolvedValue({
      message: "ok",
    } as any);

    const res = await request(makeApp()).post("/auth/forgot-password").send({
      email: "juan@test.com",
    });

    expect(res.status).toBe(200);
    expect(authService.sendResetToken).toHaveBeenCalledWith("juan@test.com");
    expect(res.body).toHaveProperty("message");
  });

  it("POST /auth/reset-password -> devuelve message", async () => {
    vi.mocked(authService.resetPassword).mockResolvedValue({
      message: "Contraseña actualizada correctamente",
    } as any);

    const res = await request(makeApp()).post("/auth/reset-password").send({
      token: "rawToken",
      newPassword: "newPass123",
    });

    expect(res.status).toBe(200);
    expect(authService.resetPassword).toHaveBeenCalled();
    expect(res.body).toHaveProperty("message");
  });

  it("GET /auth/me -> 200 si pasa authMiddleware", async () => {
    const meUser = {
      id_usuario: 10,
      name: "Juan",
      email: "juan@test.com",
      username: "juan",
      rol: "USER",
      activo: true,
    };

    vi.mocked((userService as any).getById).mockResolvedValue(meUser);
    vi.mocked((userService as any).findById).mockResolvedValue(meUser);
    vi.mocked((userService as any).obtenerUsuarioPorId).mockResolvedValue(
      meUser,
    );
    vi.mocked((userService as any).getUserById).mockResolvedValue(meUser);

    const res = await request(makeApp()).get("/auth/me");

    expect(res.status).toBe(200);
    expect(res.body).toBeTruthy();
  });
});
