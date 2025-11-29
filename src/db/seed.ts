import {
  type Categoria,
  type Notificacion,
  PrismaClient,
  type Transaccion,
  type Usuario,
} from "@prisma/client";
import { categoriasMock } from "../repositories/mock/data/categoria.data";
import { notificacionesMock } from "../repositories/mock/data/notificacion.data";
import { transaccionesMock } from "../repositories/mock/data/transaccion.data";
import { userMock } from "../repositories/mock/data/user.data";

const prisma = new PrismaClient();

class Seed {
  private usuarios: Usuario[] = [];
  private categorias: Categoria[] = [];
  private transacciones: Transaccion[] = [];
  private notificaciones: Notificacion[] = [];

  constructor(private prisma: PrismaClient) {}

  async clearDB(): Promise<void> {
    console.log("Borrando base de datos..");
    await this.prisma.notificacion.deleteMany();
    await this.prisma.transaccion.deleteMany();
    await this.prisma.listaCompras.deleteMany();
    await this.prisma.categoria.deleteMany();
    await this.prisma.usuario.deleteMany();

    console.log("Base de datos borrada.");
  }

  async seedUser(): Promise<void> {
    console.log("Creando usuarios...");
    const usersSeed = await Promise.all(
      userMock.map((user) =>
        this.prisma.usuario.create({
          data: {
            name: user.name,
            email: user.email,
            password: user.password,
            username: user.username,
            rol: user.rol,
            activo: user.activo,
            reset_token: user.reset_token,
            reset_token_expires_at: user.reset_token_expires_at,
          },
        }),
      ),
    );
    this.usuarios = usersSeed;
    console.log("Usuarios creados:");
    console.log(this.usuarios);
  }

  async seedCategories(): Promise<void> {
    console.log("Creando categorías...");
    const categoriasSeed = await Promise.all(
      categoriasMock.map((cat) =>
        this.prisma.categoria.create({
          data: {
            id_categoria: cat.id_categoria,
            nombre: cat.nombre,
            tipo: cat.tipo,
          },
        }),
      ),
    );
    this.categorias = categoriasSeed;
    console.log("Categorías creadas:");
    console.log(this.categorias);
  }

  async seedTransactions(): Promise<void> {
    console.log("Creando transacciones...");

    const transaccionesSeed = await Promise.all(
      transaccionesMock.map((tran) =>
        this.prisma.transaccion.create({
          data: {
            id_usuario: tran.id_usuario,
            id_categoria: tran.id_categoria,
            monto: tran.monto,
            descripcion: tran.descripcion,
            created_at: tran.created_at,
            updated_at: tran.updated_at,
          },
        }),
      ),
    );
    this.transacciones = transaccionesSeed;
    console.log("Transacciones creadas.");
    console.log(this.transacciones);
  }

  async seedNotifications(): Promise<void> {
    console.log("Creando notificaciones...");
    const notificacionesSeed = await Promise.all(
      notificacionesMock.map((notif) =>
        this.prisma.notificacion.create({
          data: {
            id_usuario: notif.id_usuario,
            id_categoria: notif.id_categoria,
            monto: notif.monto,
            descripcion: notif.descripcion,
            prioridad: notif.prioridad,
            fecha_vencimiento: notif.fecha_vencimiento,
            pagado: notif.pagado,
            created_at: notif.created_at,
          },
        }),
      ),
    );
    this.notificaciones = notificacionesSeed;
    console.log("Notificaciones creadas.");
    console.log(this.notificaciones);
  }

  async seedAll(): Promise<void> {
    await this.clearDB();
    await this.seedUser();
    await this.seedCategories();
    await this.seedTransactions();
    await this.seedNotifications();
    console.log("Seed completado.");
  }
}

async function main() {
  const seeder = new Seed(prisma);
  await seeder.seedAll();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
