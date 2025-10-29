import { PrismaClient } from "@prisma/client";
import { BcryptAdapter } from "../config/bcrypt";

const prisma = new PrismaClient();

class Seed {
  private hasher: BcryptAdapter;
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

    console.log("Usuarios creados:");
    console.log({ admin, user });
  }

  async seedAll(): Promise<void> {
    await this.clearDB();
    await this.seedUser();
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
