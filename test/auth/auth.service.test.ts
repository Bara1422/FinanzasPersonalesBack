import type { Usuario } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../config/env", () => ({
  ENV: {
    JWT_SECRET: "test_secret",
    FRONTEND_URL: "http_toggle",
  },
}));

vi.mock("../dtos/usuario.dto", () => ({
  toUsuarioDTO: (u: any) => ({
    id_usuario: u.id_usuario,
    name: u.name,
    email: u.email,
    username: u.username,
    rol: u.rol,
  }),
}));

let mailerEnabledValue = false;

vi.mock("../config/mailer", () => ({
  get mailerEnabled() {
    return mailerEnabledValue;
  },
  sendMail: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(() => "token_mock"),
    verify: vi.fn(() => ({ id_usuario: 10, rol: "USER" })),
  },
}));

vi.mock("crypto", async () => {
  const actual: any = await vi.importActual("crypto");
  return {
    default: {
      ...actual,
      randomBytes: vi.fn(() => Buffer.from("a".repeat(32))),
      createHash: vi.fn(() => {
        return {
          update: vi.fn().mockReturnThis(),
          digest: vi.fn(() => "hashed_token"),
        };
      }),
    },
  };
});

import jwt from "jsonwebtoken";
import { AuthService } from "../../src/services/auth.service";

describe("AuthService", () => {
  let userRepository: any;
  let service: AuthService;

  const baseUser: Usuario = {
    id_usuario: 10,
    name: "Juan",
    email: "juan@test.com",
    username: "juan",
    password: "hashed",
    rol: "USER",
    created_at: new Date(),
    updated_at: new Date(),
    activo: true,
    reset_token: null,
    reset_token_expires_at: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mailerEnabledValue = false;

    userRepository = {
      findByEmail: vi.fn(),
      findByUsername: vi.fn(),
      create: vi.fn(),
      validateCredentials: vi.fn(),
      setResetToken: vi.fn(),
      findByResetToken: vi.fn(),
      updatePassword: vi.fn(),
    };

    service = new AuthService(userRepository);
  });

  it("registerUsuario: si email ya existe => error", async () => {
    userRepository.findByEmail.mockResolvedValue(baseUser);

    await expect(
      service.registerUsuario({
        name: "A",
        email: baseUser.email,
        username: "otro",
        password: "123",
      }),
    ).rejects.toThrow("El correo ya está en uso");
  });

  it("registerUsuario: si username ya existe => error", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.findByUsername.mockResolvedValue(baseUser);

    await expect(
      service.registerUsuario({
        name: "A",
        email: "nuevo@test.com",
        username: baseUser.username,
        password: "123",
      }),
    ).rejects.toThrow("El nombre de usuario ya está en uso");
  });

  it("registerUsuario: si no se crea usuario => error 500", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.findByUsername.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(null);

    await expect(
      service.registerUsuario({
        name: "A",
        email: "nuevo@test.com",
        username: "nuevo",
        password: "123",
      }),
    ).rejects.toThrow("Error al crear el usuario");
  });

  it("registerUsuario: OK => devuelve usuario DTO + token", async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.findByUsername.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(baseUser);

    const res = await service.registerUsuario({
      name: "Juan",
      email: "juan@test.com",
      username: "juan",
      password: "123",
    });

    expect(jwt.sign).toHaveBeenCalled();
    expect(res.token).toBe("token_mock");
    expect(res.usuario).toMatchObject({
      id_usuario: 10,
      email: "juan@test.com",
      username: "juan",
      rol: "USER",
    });
  });

  it("login: credenciales inválidas => 401", async () => {
    userRepository.validateCredentials.mockResolvedValue(null);

    await expect(service.login("x@test.com", "bad")).rejects.toThrow(
      "Credenciales inválidas",
    );
  });

  it("login: OK => devuelve usuario DTO + token", async () => {
    userRepository.validateCredentials.mockResolvedValue(baseUser);

    const res = await service.login("juan@test.com", "ok");

    expect(jwt.sign).toHaveBeenCalled();
    expect(res.token).toBe("token_mock");
    expect(res.usuario.email).toBe("juan@test.com");
  });

  it("sendResetToken: si el email no existe => devuelve mensaje genérico", async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    const res = await service.sendResetToken("no@existe.com");

    expect(res.message).toContain("Si el correo está registrado");
    expect(userRepository.setResetToken).not.toHaveBeenCalled();
  });

  it("resetPassword: token inválido o expirado => 400", async () => {
    userRepository.findByResetToken.mockResolvedValue(null);

    await expect(service.resetPassword("rawToken", "newPass")).rejects.toThrow(
      "Token inválido o expirado",
    );
  });

  it("resetPassword: token expirado => 400", async () => {
    userRepository.findByResetToken.mockResolvedValue({
      ...baseUser,
      reset_token_expires_at: new Date(Date.now() - 1000),
    });

    await expect(service.resetPassword("rawToken", "newPass")).rejects.toThrow(
      "Token inválido o expirado",
    );
  });

  it("resetPassword: OK => actualiza password", async () => {
    userRepository.findByResetToken.mockResolvedValue({
      ...baseUser,
      reset_token_expires_at: new Date(Date.now() + 1000 * 60),
    });

    userRepository.updatePassword.mockResolvedValue(undefined);

    const res = await service.resetPassword("rawToken", "newPass");

    expect(userRepository.updatePassword).toHaveBeenCalledWith(10, "newPass");
    expect(res.message).toBe("Contraseña actualizada correctamente");
  });

  it("verifyToken: token inválido => 401", async () => {
    (jwt.verify as any).mockImplementationOnce(() => {
      throw new Error("bad");
    });

    await expect(service.verifyToken("badtoken")).rejects.toThrow(
      "Token inválido",
    );
  });

  it("verifyToken: token válido => devuelve payload", async () => {
    (jwt.verify as any).mockReturnValueOnce({ id_usuario: 10, rol: "USER" });

    const payload = await service.verifyToken("goodtoken");

    expect(payload).toEqual({ id_usuario: 10, rol: "USER" });
  });
});
