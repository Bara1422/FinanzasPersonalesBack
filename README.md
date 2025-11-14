# Sistema de Gestión de Finanzas Personales - Backend

---

##### Descripción general

API para gestión de finanzas personales, incluye generación de usuarios,
transacciones, notificaciones y generación de informes. Desarrollada con
Node.js, Express y TypeScript, aplicando una arquitectura MVC incluyendo una
capa de servicios.

---

##### Tecnologías utilizadas

- **Lenguaje**: Typescript
- **Framework**: Express.js
- **ORM**: Prisma
- **Base de datos**: PostgreSQL
- **Validaciones**: Zod
- **Autenticación**: JWT (jsonwebtoken)
- **Exportación de Archivos**: pdfmake, exceljs
- **Linting**: Biomejs

---

##### Requisitos previos

- [Node.js 18+](https://nodejs.org/es/download)
- [Biome IDE extensión](https://biomejs.dev/guides/editors/first-party-extensions/)
- [Prisma IDE extensión](https://www.prisma.io/docs/orm/more/development-environment/editor-setup)

---

##### Instalación

1. Clonar el repositorio

```bash
git clone https://github.com/Bara1422/FinanzasPersonalesBack.git
cd FinanzasPersonalesBack
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno (_**.env**_) Crear un archivo **.env** en la
   raiz del proyecto basandose en el **.env.example**
   ```javascript
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=1d
   NODE_ENV=development
   PORT=3000
   DATABASE_URL=
   CORS_ORIGIN=
   ```

4. Generar codigo cliente de Prisma para tipado estricto en TypeScript

```bash
npm run prisma:generate
```

5. Ejecutar la seed de Prisma para restablecer la base de datos a unos valores
   iniciales

```bash
npm run prisma:seed
Al correr el comando se le preguntará si desea resetar la base de datos. 
 Are you sure you want to reset your database? All data will be lost.

 Apretar "Y"
```

6. Ejecutar la API en desarrollo

```bash
npm run dev
```

7. Realizar las consultas en Postman mediante la coleccion proporcionada,
   ingresar el token obtenido en el login o register en los headers de
   Authorization de Postman.

---
 Para mejor experiencia conectar con el frontend
[Finanzas Personales Frontend](https://github.com/Bara1422/FinanzasPersonalesFront/tree/dev)

![Dashboard frontend](src/public/dashbaordscreen.png)
---

##### Estructura del proyecto

```bash
/prisma                   # Prisma Schema y migracioens
/src
 ├── config/              # Configuraciones de envs y bcrypt
 ├── controllers/         # Controladores de cada recurso
 ├── db/                  # Configuracion prisma y seed
 ├── dtos/                 # Data Transfer Objects
 ├── middlewares/         # Autenticación, validación, user-rol, errores
 ├── repositories/        # Repositorios separados en Mock y Prisma
 ├── routes/              # Definición de rutas Express
 ├── schemas/             # Validaciones Zod
 ├── services/            # Lógica de negocio
 ├── types/               # Tipado TypeScript
 ├── utils/               # CustomError, Excel y PDF exporters
 ├── app.ts               # Configuracion express
 └── index.ts             # Entrypoint del servidor
```

---

##### Integrantes

- Ismael Cordoba
- Mariana Baradad
- Juan Baranovsky
- Francisco Rios
- Hernan Folik

##### TeamLeader :

- Juan Baranovsky
