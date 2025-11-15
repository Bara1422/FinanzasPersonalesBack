// tests/repositories/user.repository.mock.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { UserRepositoryMock } from "../../src/repositories/mock/UserRepositoryMock";
import { BcryptAdapter } from "../../src/config/bcrypt";
import { userMock } from "../../src/repositories/mock/data/user.data";

let repository: UserRepositoryMock;
const hasher = BcryptAdapter.getInstance();

describe("UserRepositoryMock", () => {
  beforeEach(() => {
    repository = new UserRepositoryMock(hasher);
  });

  it("findByEmail: debe devolver un usuario existente por email", async () => {
    const user = await repository.findByEmail("admin@example.com");
    expect(user).toBeDefined();
    expect(user?.email).toBe("admin@example.com");
  });

  it("findByEmail: debe devolver null si no existe el email", async () => {
    const user = await repository.findByEmail("noexiste@example.com");
    expect(user).toBeNull();
  });

  it("findByUsername: debe devolver un usuario existente por username", async () => {
    const user = await repository.findByUsername("user");
    expect(user).toBeDefined();
    expect(user?.username).toBe("user");
  });

  it("findByUsername: debe devolver null si no existe el username", async () => {
    const user = await repository.findByUsername("no_user");
    expect(user).toBeNull();
  });

  it("findAll: debe devolver todos los usuarios", async () => {
    const users = await repository.findAll();
    expect(users.length).toBe(userMock.length);
  });

  it("findById: debe devolver un usuario por ID existente", async () => {
    const user = await repository.findById(1);
    expect(user).toBeDefined();
    expect(user?.id_usuario).toBe(1);
  });

  it("findById: debe devolver null si no existe el ID", async () => {
    const user = await repository.findById(999);
    expect(user).toBeNull();
  });

  it("create: debe crear un nuevo usuario", async () => {
    const newUser = await repository.create({
      name: "Nuevo",
      email: "nuevo@example.com",
      username: "nuevo",
      password: "123456",
    });

    expect(newUser).toHaveProperty("id_usuario");
    expect(newUser.email).toBe("nuevo@example.com");

    const allUsers = await repository.findAll();
    expect(allUsers.length).toBe(userMock.length );
  });

  it("update: debe actualizar un usuario existente", async () => {
    const updatedUser = await repository.update(1, { name: "Admin Modificado" });
    expect(updatedUser?.name).toBe("Admin Modificado");

    const user = await repository.findById(1);
    expect(user?.name).toBe("Admin Modificado");
  });

  it("update: debe devolver null si no existe el usuario", async () => {
    const updatedUser = await repository.update(999, { name: "Nada" });
    expect(updatedUser).toBeNull();
  });

  it("delete: debe eliminar un usuario existente", async () => {
    const msg = await repository.delete(1);
    expect(msg).toBe("Usuario eliminado correctamente");

    const user = await repository.findById(1);
    expect(user).toBeNull();
  });

  it("validateCredentials: debe devolver usuario si email y password son correctos", async () => {
    const user = await repository.validateCredentials("admin@example.com", "123456");
    expect(user).toBeDefined();
    expect(user?.email).toBe("admin@example.com");
  });

  it("validateCredentials: debe devolver null si el password es incorrecto", async () => {
    const user = await repository.validateCredentials("admin@example.com", "wrongpass");
    expect(user).toBeNull();
  });

  it("validateCredentials: debe devolver null si el email no existe", async () => {
    const user = await repository.validateCredentials("noexiste@example.com", "123456");
    expect(user).toBeNull();
  });
});
