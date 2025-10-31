import {
  type Categoria,
  PrismaClient,
  type Transaccion,
  type Usuario,
} from "@prisma/client";
import { BcryptAdapter } from "../config/bcrypt";
import { MOCK_CATEGORIAS_DATA } from "../repositories/mock/CategoryRepositoryMock";

const prisma = new PrismaClient();

class Seed {
  private hasher: BcryptAdapter;
  private usuarios: Usuario[] = [];
  private categorias: Categoria[] = [];
  private transacciones: Transaccion[] = [];

  constructor(private prisma: PrismaClient) {
    this.hasher = new BcryptAdapter();
  }

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
    const admin = await this.prisma.usuario.create({
      data: {
        name: "Admin",
        email: "admin@example.com",
        password: this.hasher.hash("1234"),
        username: "admin",
        rol: "ADMIN",
        activo: true,
      },
    });

    const user = await this.prisma.usuario.create({
      data: {
        name: "User",
        email: "user@example.com",
        password: this.hasher.hash("1234"),
        username: "user",
        rol: "USER",
        activo: true,
      },
    });
    this.usuarios.push(admin, user);
    console.log("Usuarios creados:");
    console.log(this.usuarios);
  }

  async seedCategories(): Promise<void> {
    console.log("Creando categorías...");
    const categoriasSeed = await Promise.all(
      MOCK_CATEGORIAS_DATA.map((cat) =>
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
    const findCategoryByName = (name: string): Categoria | undefined => {
      return this.categorias.find((c) => c.nombre === name);
    };
    const transaccionesSeed = await Promise.all(
      [
        {
          id_usuario: this.usuarios[0].id_usuario,
          id_categoria: findCategoryByName("Salario")?.id_categoria,
          monto: 100.5,
          descripcion: "Depósito inicial",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id_usuario: this.usuarios[0].id_usuario,
          id_categoria: findCategoryByName("Alimentos")?.id_categoria,
          monto: 50.0,
          descripcion: "Compra de alimentos",
          created_at: new Date("2024-06-15"),
          updated_at: new Date(),
        },
      ].map((tran) => this.prisma.transaccion.create({ data: tran })),
    );
    this.transacciones = transaccionesSeed;
    console.log("Transacciones creadas.");
    console.log(this.transacciones);
  }

  async seedAll(): Promise<void> {
    await this.clearDB();
    await this.seedUser();
    await this.seedCategories();
    await this.seedTransactions();
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
