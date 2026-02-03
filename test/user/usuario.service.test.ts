import type { Usuario } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserService } from "../../src/services/usuario.service";
import { CustomError } from "../../src/utils/CustomError";

vi.mock("../../src/dtos/usuario.dto", () => ({
  toUsuarioDTO: (u: any) => ({
    id_usuario: u.id_usuario,
    name: u.name,
    email: u.email,
    username: u.username,
    rol: u.rol,
  }),
}));

describe("UserService", () => {
  let repo: any;
  let service: UserService;

  const baseUser: Usuario = {
    id_usuario: 10,
    name: "Juan",
    email: "juan@test.com",
    username: "juan",
    password: "hashed",
    rol: "USER" as any,
    created_at: new Date(),
    updated_at: new Date(),
    activo: true,
    reset_token: null,
    reset_token_expires_at: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    repo = {
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    service = new UserService(repo);
  });

  it("getAll: devuelve usuarios (DTO)", async () => {
    repo.findAll.mockResolvedValue([baseUser]);

    const res = await service.getAll();

    expect(repo.findAll).toHaveBeenCalled();
    expect(res).toEqual([
      {
        id_usuario: 10,
        name: "Juan",
        email: "juan@test.com",
        username: "juan",
        rol: "USER",
      },
    ]);
  });

  it("findById: si no existe => CustomError 404", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.findById(999)).rejects.toThrow(
      "Usuario no encontrado",
    );

    try {
      await service.findById(999);
    } catch (e: any) {
      expect(e).toBeInstanceOf(CustomError);
      expect(e.statusCode ?? e.status).toBe(404);
    }
  });

  it("findById: si existe => devuelve DTO", async () => {
    repo.findById.mockResolvedValue(baseUser);

    const res = await service.findById(10);

    expect(repo.findById).toHaveBeenCalledWith(10);
    expect(res).toMatchObject({
      id_usuario: 10,
      email: "juan@test.com",
      username: "juan",
    });
  });

  it("update: si no existe => CustomError 404", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.update(10, { name: "Nuevo" })).rejects.toThrow(
      "Usuario no encontrado",
    );

    expect(repo.update).not.toHaveBeenCalled();
  });

  it("update: OK => llama update y devuelve DTO", async () => {
    repo.findById.mockResolvedValue(baseUser);
    repo.update.mockResolvedValue({ ...baseUser, name: "Nuevo" });

    const res = await service.update(10, { name: "Nuevo" });

    expect(repo.update).toHaveBeenCalledWith(10, { name: "Nuevo" });
    expect(res).toMatchObject({ id_usuario: 10, name: "Nuevo" });
  });

  it("delete: si no existe => CustomError 404", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.delete(10)).rejects.toThrow("Usuario no encontrado");

    expect(repo.delete).not.toHaveBeenCalled();
  });

  it("delete: OK => llama delete y devuelve mensaje", async () => {
    repo.findById.mockResolvedValue(baseUser);
    repo.delete.mockResolvedValue(undefined);

    const res = await service.delete(10);

    expect(repo.delete).toHaveBeenCalledWith(10);
    expect(res).toBe("Usuario eliminado correctamente");
  });
});
