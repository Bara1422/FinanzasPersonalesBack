# 🧭 Guía de Buenas Prácticas – Proyecto Sistema de Finanzas Personales

## 1. Estructura del Backend (Node + TypeScript + MVC + Servicios)

/src
 ├── controllers/     → Reciben la request, validan, llaman a los servicios.
 ├── services/        → Lógica de negocio (procesos, validaciones, cálculos).
 ├── repositories/    → Acceso a base de datos (consultas CRUD).
 ├── routes/          → Define endpoints y vincula controladores.
 ├── models/          → Definiciones de entidades / ORM (Sequelize/Mongoose).
 ├── middlewares/     → Autenticación, validaciones, logs.
 ├── utils/           → Helpers genéricos, manejo de errores, formateos.
 ├── config/          → Configuraciones globales (DB, entorno, cors, etc.).
 ├── app.ts           → Inicializa Express, middlewares y rutas.
 └── server.ts        → Levanta el servidor.

**Principio:**  
- Los *controladores* no deben contener lógica de negocio, solo orquestan servicios.  
- Los *servicios* encapsulan la lógica (reglas, cálculos, validaciones, coordinan repos).  
- Los *repositorios* se encargan exclusivamente del acceso a datos (queries, ORM).  

## 2. Flujo de trabajo en Git

### Creación de rama por feature
1. Antes de empezar una tarea, asegurate de estar en `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   ```
2. Crear una nueva rama:
   ```bash
   git checkout -b feature/nombre-feature
   ```
   Ejemplos:
   - `feature/login-usuario`
   - `feature/reporte-mensual`
   - `fix/error-auth`
   - `refactor/servicio-transaccion`

### Agregar cambios y commitear

1. Agregar archivos modificados:
   ```bash
   git add .
   ```
2. Realizar el commit siguiendo el **patrón convencional de mensajes**:
   ```
   <tipo>: <mensaje>
   ```

   **Tipos válidos:**
   - `feat` → nueva funcionalidad  
   - `fix` → corrección de bug  
   - `refactor` → mejora de código sin cambiar lógica  
   - `docs` → cambios en documentación  
   - `chore` → tareas menores o configuración  
   - `style` → formateo, identación  

   **Ejemplos:**
   ```
   feat(usuario): agregar validación de email en registro
   fix(transaccion): corregir error al calcular balance mensual
   refactor(servicio): separar lógica de creación de notificación
   ```

### Subir rama al repositorio

```bash
git push origin feature/nombre-feature
```

### Crear Pull Request (PR) en GitHub

1. Entrar al repositorio en GitHub.
2. Aparecerá el aviso **"Compare & pull request"** → clic.
3. Completar:
   - **Title:** mismo que el commit principal.
   - **Description:** breve resumen del cambio (qué hace, por qué).
   - **Reviewers:** asignar al responsable del módulo o al líder técnico.
4. Una vez aprobado → **Merge** a `dev`.
5. Se borrará la rama desde github una vez integrado.


## 3. Linting con Biome.js


### Configuración de VSCode
Crear o editar `.vscode/settings.json`:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit"
  },
  "editor.defaultFormatter": "biomejs.biome",
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "eslint.enable": false,
  "prettier.enable": false
}
```
Esto:
- Activa Biome para TypeScript.
- Desactiva Prettier y ESLint.
- Solo formatea si haces Ctrl+S y tenés "source.fixAll.biome": "explicit".

### Ejecución manual
```bash
npx biome check .
npx biome format .
```

### Recomendación
- Antes de hacer commit, ejecutar:
  ```bash
  npx biome check .
  ```
  Corrige automáticamente formato, espacios, imports, etc.

## 4. Reglas de colaboración

- Toda nueva funcionalidad → rama `feature/`.
- No se mergea a `dev` sin PR y revisión.
- Commits deben seguir el patrón semántico.
- Ejecutar lint antes de cada commit.
- No subir archivos de entorno ni configuraciones locales (`.env`, `.vscode`).
- Los controladores nunca deben tener lógica compleja (solo llamar servicios).

**Resultado esperado:**  
Código homogéneo, limpio, formateado automáticamente, con historial git legible y controlado mediante Pull Requests.
