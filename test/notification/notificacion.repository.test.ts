import { $Enums } from "@prisma/client";
import { beforeEach, describe, expect, it } from "vitest";
import { notificacionesMock } from "../../src/repositories/mock/data/notificacion.data";
import { NotificacionRepositoryMock } from "../../src/repositories/mock/NotificacionRepositoryMock";

describe("NotificacionRepositoryMock", () => {
  let repo: NotificacionRepositoryMock;

  beforeEach(() => {
    repo = new NotificacionRepositoryMock();

    (repo as any).notificacionesDB = [...notificacionesMock];
  });

  it("debe retornar todas las notificaciones", async () => {
    const notificaciones = await repo.findAll();

    expect(notificaciones.length).toBe(notificacionesMock.length);
    expect(notificaciones).toEqual(notificacionesMock);
  });

  it("debe retornar una notificación por ID existente", async () => {
    const id = notificacionesMock[0].id_notificacion;

    const notificacion = await repo.findById(id);

    expect(notificacion).not.toBeNull();
    expect(notificacion?.id_notificacion).toBe(id);
  });

  it("debe retornar null cuando el ID no existe", async () => {
    const notificacion = await repo.findById(999999);

    expect(notificacion).toBeNull();
  });

  it("debe retornar notificaciones por usuario", async () => {
    const idUsuario = notificacionesMock[0].id_usuario;

    const notificaciones = await repo.findByUserId(idUsuario);

    expect(notificaciones.length).toBeGreaterThan(0);
    expect(notificaciones.every((n) => n.id_usuario === idUsuario)).toBe(true);
  });

  it("debe retornar solo pendientes (pagado=false) por usuario", async () => {
    const idUsuario = notificacionesMock[0].id_usuario;

    const notificaciones = await repo.findPendingByUserId(idUsuario);

    expect(
      notificaciones.every((n) => n.id_usuario === idUsuario && !n.pagado),
    ).toBe(true);
  });

  it("debe retornar solo pagadas (pagado=true) por usuario", async () => {
    const idUsuario = notificacionesMock[0].id_usuario;

    const notificaciones = await repo.findPaidByUserId(idUsuario);

    expect(
      notificaciones.every((n) => n.id_usuario === idUsuario && n.pagado),
    ).toBe(true);
  });

  it("create: debe crear una notificación y agregarla al listado", async () => {
    const before = (await repo.findAll()).length;

    const nueva = await repo.create(
      {
        id_categoria: 1,
        monto: 1500,
        descripcion: "Netflix",
        prioridad: $Enums.Prioridad.MEDIA,
        fecha_vencimiento: new Date(),
      },
      10,
    );

    const after = (await repo.findAll()).length;

    expect(after).toBe(before + 1);
    expect(nueva).toMatchObject({
      id_usuario: 10,
      id_categoria: 1,
      monto: 1500,
      descripcion: "Netflix",
      pagado: false,
    });
    expect(nueva.id_notificacion).toBeGreaterThan(0);
  });

  it("update: debe actualizar una notificación existente", async () => {
    const id = notificacionesMock[0].id_notificacion;

    const updated = await repo.update(id, { descripcion: "Actualizada" });

    expect(updated.id_notificacion).toBe(id);
    expect(updated.descripcion).toBe("Actualizada");
    expect(updated.updated_at).toBeInstanceOf(Date);
  });

  it("update: si no existe => tira error", async () => {
    await expect(repo.update(999999, { descripcion: "x" })).rejects.toThrow(
      "Notificacion no encontrada",
    );
  });

  it("delete: debe eliminar una notificación", async () => {
    const id = notificacionesMock[0].id_notificacion;
    const before = (await repo.findAll()).length;

    const msg = await repo.delete(id);

    const after = (await repo.findAll()).length;

    expect(msg).toBe("Notificación eliminada correctamente");
    expect(after).toBe(before - 1);
    expect(await repo.findById(id)).toBeNull();
  });

  it("markAsPaid: debe marcar como pagada si estaba pendiente", async () => {
    const pendiente = (await repo.findAll()).find((n) => !n.pagado);

    expect(pendiente).toBeTruthy();

    const updated = await repo.markAsPaid(pendiente!.id_notificacion);

    expect(updated?.pagado).toBe(true);
    expect(updated?.updated_at).toBeInstanceOf(Date);
  });

  it("markAsPaid: si no existe => tira error", async () => {
    await expect(repo.markAsPaid(999999)).rejects.toThrow(
      "Notificacion no encontrada",
    );
  });

  it("markAsPaid: si ya estaba pagada => tira error", async () => {
    const creada = await repo.create(
      {
        id_categoria: 1,
        monto: 100,
        descripcion: "Prueba",
        prioridad: $Enums.Prioridad.MEDIA,
        fecha_vencimiento: new Date(),
      },
      10,
    );

    await repo.markAsPaid(creada.id_notificacion);

    await expect(repo.markAsPaid(creada.id_notificacion)).rejects.toThrow(
      "La notificación ya está marcada como pagada",
    );
  });
});
