import type { Usuario } from "@prisma/client";
import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../../src/app"; //

describe("AuthController", () => {
  const newUser: Usuario = {
    name: "Juan Perez",
    email: "test@example.com",
    username: "testuser",
    password: "Password123!",
    rol: "USER",
    id_usuario: 0,
    created_at: new Date(),
    updated_at: new Date(),
    activo: true,
    reset_token: null,
    reset_token_expires_at: null,
  };

  it("POST /auth/register - Debería crear un usuario exitosamente", async () => {
    const response = await request(app).post("/auth/register").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("token");
    expect(response.body.usuario?.email).toBe(newUser.email);
  });

  it("POST /auth/login - Debería fallar con credenciales incorrectas", async () => {
    const response = await request(app).post("/auth/login").send({
      email: newUser.email,
      password: "WrongPassword",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("POST /auth/register - Debería fallar si faltan campos (Validación Zod)", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ email: "invalido" });

    expect(response.status).toBe(400);
  });
});
