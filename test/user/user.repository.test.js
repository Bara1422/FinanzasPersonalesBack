"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tests/repositories/user.repository.mock.test.ts
const vitest_1 = require("vitest");
const UserRepositoryMock_1 = require("./../../src/repositories/mock/UserRepositoryMock");
const bcrypt_1 = require("../../src/config/bcrypt");
const user_data_1 = require("./../../src/repositories/mock/data/user.data");
let repository;
const hasher = bcrypt_1.BcryptAdapter.getInstance();
(0, vitest_1.describe)("UserRepositoryMock", () => {
    (0, vitest_1.beforeEach)(() => {
        repository = new UserRepositoryMock_1.UserRepositoryMock(hasher);
    });
    (0, vitest_1.it)("findByEmail: debe devolver un usuario existente por email", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield repository.findByEmail("admin@example.com");
        (0, vitest_1.expect)(user).toBeDefined();
        (0, vitest_1.expect)(user === null || user === void 0 ? void 0 : user.email).toBe("admin@example.com");
    }));
    (0, vitest_1.it)("findByEmail: debe devolver null si no existe el email", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield repository.findByEmail("noexiste@example.com");
        (0, vitest_1.expect)(user).toBeNull();
    }));
    (0, vitest_1.it)("findByUsername: debe devolver un usuario existente por username", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield repository.findByUsername("user");
        (0, vitest_1.expect)(user).toBeDefined();
        (0, vitest_1.expect)(user === null || user === void 0 ? void 0 : user.username).toBe("user");
    }));
    (0, vitest_1.it)("findByUsername: debe devolver null si no existe el username", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield repository.findByUsername("no_user");
        (0, vitest_1.expect)(user).toBeNull();
    }));
    (0, vitest_1.it)("findAll: debe devolver todos los usuarios", () => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield repository.findAll();
        (0, vitest_1.expect)(users.length).toBe(user_data_1.userMock.length);
    }));
    (0, vitest_1.it)("findById: debe devolver un usuario por ID existente", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield repository.findById(1);
        (0, vitest_1.expect)(user).toBeDefined();
        (0, vitest_1.expect)(user === null || user === void 0 ? void 0 : user.id_usuario).toBe(1);
    }));
    (0, vitest_1.it)("findById: debe devolver null si no existe el ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield repository.findById(999);
        (0, vitest_1.expect)(user).toBeNull();
    }));
    (0, vitest_1.it)("create: debe crear un nuevo usuario", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = yield repository.create({
            name: "Nuevo",
            email: "nuevo@example.com",
            username: "nuevo",
            password: "123456",
        });
        (0, vitest_1.expect)(newUser).toHaveProperty("id_usuario");
        (0, vitest_1.expect)(newUser.email).toBe("nuevo@example.com");
        const allUsers = yield repository.findAll();
        (0, vitest_1.expect)(allUsers.length).toBe(user_data_1.userMock.length);
    }));
    (0, vitest_1.it)("update: debe actualizar un usuario existente", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = yield repository.update(1, { name: "Admin Modificado" });
        (0, vitest_1.expect)(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.name).toBe("Admin Modificado");
        const user = yield repository.findById(1);
        (0, vitest_1.expect)(user === null || user === void 0 ? void 0 : user.name).toBe("Admin Modificado");
    }));
    (0, vitest_1.it)("update: debe devolver null si no existe el usuario", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedUser = yield repository.update(999, { name: "Nada" });
        (0, vitest_1.expect)(updatedUser).toBeNull();
    }));
    (0, vitest_1.it)("delete: debe eliminar un usuario existente", () => __awaiter(void 0, void 0, void 0, function* () {
        const msg = yield repository.delete(1);
        (0, vitest_1.expect)(msg).toBe("Usuario eliminado correctamente");
        const user = yield repository.findById(1);
        (0, vitest_1.expect)(user).toBeNull();
    }));
    (0, vitest_1.it)("validateCredentials: debe devolver usuario si email y password son correctos", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield repository.validateCredentials("admin@example.com", "123456");
        (0, vitest_1.expect)(user).toBeDefined();
        (0, vitest_1.expect)(user === null || user === void 0 ? void 0 : user.email).toBe("admin@example.com");
    }));
    (0, vitest_1.it)("validateCredentials: debe devolver null si el password es incorrecto", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield repository.validateCredentials("admin@example.com", "wrongpass");
        (0, vitest_1.expect)(user).toBeNull();
    }));
    (0, vitest_1.it)("validateCredentials: debe devolver null si el email no existe", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield repository.validateCredentials("noexiste@example.com", "123456");
        (0, vitest_1.expect)(user).toBeNull();
    }));
});
//# sourceMappingURL=user.repository.test.js.map