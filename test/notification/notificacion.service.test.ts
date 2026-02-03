import type { Categoria, Notificacion } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotificacionService } from "../../src/services/notificacion.service";

describe("NotificacionService", () => {
  let notificacionRepo: any;
  let categoriaRepo: any;
  let service: NotificacionService;

  const baseNoti: Notificacion = {
    id_notificacion: 1,
    id_usuario: 10,
    id_categoria: 1,
    descripcion: "Netflix",
    monto: 1000,
    prioridad: "MEDIA" as any,
    fecha_vencimiento: new Date(Date.now() + 1000 * 60 * 60),
    pagado: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    notificacionRepo = {
      create: vi.fn(),
      findById: vi.fn(),
      findAll: vi.fn(),
      findByUserId: vi.fn(),
      findPendingByUserId: vi.fn(),
      findPaidByUserId: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      markAsPaid: vi.fn(),
    };

    categoriaRepo = {
      getById: vi.fn(),
    };

    service = new NotificacionService(notificacionRepo, categoriaRepo);
  });

  it("crearNotificacion: si categoría no existe => 400", async () => {
    categoriaRepo.getById.mockResolvedValue(null);

    await expect(
      service.crearNotificacion(
        {
          id_categoria: 999,
          fecha_vencimiento: new Date(Date.now() + 1000),
        } as any,
        10,
      ),
    ).rejects.toThrow("La categoría especificada no existe");

    expect(notificacionRepo.create).not.toHaveBeenCalled();
  });

  it("crearNotificacion: si fecha vencimiento en pasado => 400", async () => {
    categoriaRepo.getById.mockResolvedValue({ id_categoria: 1 } as Categoria);

    await expect(
      service.crearNotificacion(
        {
          id_categoria: 1,
          fecha_vencimiento: new Date(Date.now() - 1000),
        } as any,
        10,
      ),
    ).rejects.toThrow("La fecha de vencimiento no puede ser en el pasado");

    expect(notificacionRepo.create).not.toHaveBeenCalled();
  });

  it("crearNotificacion: OK => llama create", async () => {
    categoriaRepo.getById.mockResolvedValue({ id_categoria: 1 } as Categoria);
    notificacionRepo.create.mockResolvedValue(baseNoti);

    const res = await service.crearNotificacion(
      {
        id_categoria: 1,
        descripcion: "Netflix",
        monto: 1000,
        prioridad: "MEDIA",
        fecha_vencimiento: new Date(Date.now() + 1000 * 60),
      } as any,
      10,
    );

    expect(notificacionRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ id_categoria: 1 }),
      10,
    );
    expect(res).toBeTruthy();
  });

  it("actualizarNotificacion: si no existe => 404", async () => {
    notificacionRepo.findById.mockResolvedValue(null);

    await expect(
      service.actualizarNotificacion(1, { descripcion: "x" } as any, 10),
    ).rejects.toThrow("Notificación no encontrada");
  });

  it("actualizarNotificacion: si no es dueño => 403", async () => {
    notificacionRepo.findById.mockResolvedValue({
      ...baseNoti,
      id_usuario: 999,
    });

    await expect(
      service.actualizarNotificacion(1, { descripcion: "x" } as any, 10),
    ).rejects.toThrow("No tienes permiso para actualizar esta notificación");
  });

  it("actualizarNotificacion: si cambia categoría y no existe => 400", async () => {
    notificacionRepo.findById.mockResolvedValue(baseNoti);
    categoriaRepo.getById.mockResolvedValue(null);

    await expect(
      service.actualizarNotificacion(1, { id_categoria: 999 } as any, 10),
    ).rejects.toThrow("La categoría especificada no existe");

    expect(notificacionRepo.update).not.toHaveBeenCalled();
  });

  it("actualizarNotificacion: OK => llama update", async () => {
    notificacionRepo.findById.mockResolvedValue(baseNoti);
    categoriaRepo.getById.mockResolvedValue({ id_categoria: 1 } as Categoria);
    notificacionRepo.update.mockResolvedValue({
      ...baseNoti,
      descripcion: "Nueva",
    });

    const res = await service.actualizarNotificacion(
      1,
      { descripcion: "Nueva", id_categoria: 1 } as any,
      10,
    );

    expect(notificacionRepo.update).toHaveBeenCalledWith(1, {
      descripcion: "Nueva",
      id_categoria: 1,
    });
    expect(res).toBeTruthy();
  });

  it("eliminarNotificacion: si no existe => 404", async () => {
    notificacionRepo.findById.mockResolvedValue(null);

    await expect(service.eliminarNotificacion(1, 10)).rejects.toThrow(
      "Notificación no encontrada",
    );
  });

  it("eliminarNotificacion: si no es dueño => 403", async () => {
    notificacionRepo.findById.mockResolvedValue({
      ...baseNoti,
      id_usuario: 999,
    });

    await expect(service.eliminarNotificacion(1, 10)).rejects.toThrow(
      "No tienes permiso para eliminar esta notificación",
    );
  });

  it("eliminarNotificacion: OK => llama delete", async () => {
    notificacionRepo.findById.mockResolvedValue(baseNoti);
    notificacionRepo.delete.mockResolvedValue("ok");

    const res = await service.eliminarNotificacion(1, 10);

    expect(notificacionRepo.delete).toHaveBeenCalledWith(1);
    expect(res).toBe("ok");
  });

  it("marcarNotificacionComoPagada: si no existe => 404", async () => {
    notificacionRepo.findById.mockResolvedValue(null);

    await expect(service.marcarNotificacionComoPagada(1, 10)).rejects.toThrow(
      "Notificación no encontrada",
    );
  });

  it("marcarNotificacionComoPagada: si no es dueño => 403", async () => {
    notificacionRepo.findById.mockResolvedValue({
      ...baseNoti,
      id_usuario: 999,
    });

    await expect(service.marcarNotificacionComoPagada(1, 10)).rejects.toThrow(
      "No tienes permiso para actualizar esta notificación",
    );
  });

  it("marcarNotificacionComoPagada: si ya está pagada => 400", async () => {
    notificacionRepo.findById.mockResolvedValue({ ...baseNoti, pagado: true });

    await expect(service.marcarNotificacionComoPagada(1, 10)).rejects.toThrow(
      "La notificación ya está marcada como pagada",
    );
  });

  it("marcarNotificacionComoPagada: OK => llama markAsPaid", async () => {
    notificacionRepo.findById.mockResolvedValue(baseNoti);
    notificacionRepo.markAsPaid.mockResolvedValue({
      ...baseNoti,
      pagado: true,
    });

    const res = await service.marcarNotificacionComoPagada(1, 10);

    expect(notificacionRepo.markAsPaid).toHaveBeenCalledWith(1);
    expect(res).toBeTruthy();
  });
});
