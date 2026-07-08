# Final — Vivero Takumi

**Materia:** Plataformas de Desarrollo  
**Proyecto:** Vivero Takumi (frontend React + backend Express)

---

## Requisitos del final (cumplidos)

| Requisito | Implementación |
|-----------|----------------|
| **Mínimo 2 tipos de usuarios** | 4 roles: `admin`, `manager`, `empleado`, `cliente` |
| **Seguridad con access token** | JWT (`Authorization: Bearer <token>`), bcrypt en contraseñas, middleware `requireAuth` + `requireRole` |
| **API REST** | Express en `backend/` — plantas, categorías, pedidos, usuarios, auth |
| **Frontend y backend separados** | React (raíz del repo) + API Express (`backend/`) consumida por fetch |

---

## Estructura del proyecto

```
vivero-takumi/
├── frontend/                # SPA React (Vite)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env                 # VITE_API_URL
└── backend/                 # API Express + MySQL
    ├── app.js
    ├── sql/setup-local.sql
    └── src/ (routes, controllers, models, ...)
```

---

## Cómo levantar todo

### 1. Base de datos (MySQL local)

MySQL tiene que estar corriendo en tu máquina (puerto 3306).

```bash
sudo mysql < backend/sql/setup-local.sql
```

Eso crea la base `vivero_takumi` y el usuario `vivero` / `vivero123`.

Luego:

```bash
cd backend
cp .env.example .env
npm install
npm run seed
```

Si usás otro usuario o contraseña, editá `backend/.env` para que coincida con MySQL.

### 2. Backend (API)

```bash
cd backend
npm run dev
# → http://localhost:8888
```

Probar: `curl http://localhost:8888/api/health`

**Documentación Swagger:** [http://localhost:8888/api/docs](http://localhost:8888/api/docs)

### 3. Frontend

```bash
cd frontend
cp .env.example .env
pnpm install
pnpm dev
# → http://localhost:5173
```

---

## Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Registro cliente |
| POST | `/api/auth/login` | No | Login → `accessToken` + `refreshToken` |
| GET | `/api/auth/refresh-token` | Refresh | Renovar access token |
| GET | `/api/auth/me` | Sí | Usuario actual |
| GET | `/api/plantas` | Opcional | Catálogo |
| GET/POST/PUT/DELETE | `/api/plantas/:ID` | Staff | CRUD plantas |
| GET | `/api/categorias` | No | Listado |
| POST/PUT/DELETE | `/api/categorias` | Staff | CRUD categorías |
| GET | `/api/pedidos` | Sí | Pedidos (cliente ve solo los suyos) |
| POST | `/api/pedidos` | No* | Crear pedido (checkout invitado o logueado) |
| PATCH | `/api/pedidos/:ID/estado` | Staff | Cambiar estado |
| GET/POST/PUT/DELETE | `/api/usuarios` | Admin | Gestión usuarios |

\* El checkout funciona con o sin sesión; las rutas de staff exigen JWT.

---

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | gonzalo.reynoso9@gmail.com | _(ver seed)_ |
| Manager | manager@viverotakumi.com | manager123 |
| Empleado | empleado@viverotakumi.com | emp123 |
| Cliente | cliente@viverotakumi.com | cli123 |

---

## Demo sugerida para el examen

1. **Catálogo** sin login — datos vienen del API (`GET /plantas`)
2. **Registro + login** cliente — JWT en localStorage
3. **Checkout** — crea pedido vía `POST /pedidos`, descuenta stock en MySQL
4. **Mis compras** — `GET /pedidos` filtrado por email del token
5. **Login admin** — dashboard, CRUD plantas/usuarios
6. **Login empleado** — actualizar stock y estado de pedidos
7. **Postman** — mostrar ruta protegida sin token (401) y con token (200)

---

## Entrega ZIP

```
TP_GONZALO_REYNOSO.zip
├── TP_GONZALO_REYNOSO.docx
├── frontend/          # SPA React
└── backend/           # API Express
```

```bash
zip -r TP_GONZALO_REYNOSO.zip TP_GONZALO_REYNOSO.docx frontend backend \
  -x "frontend/node_modules/*" -x "backend/node_modules/*" -x "frontend/dist/*"
```

O reemplazar carpetas por URL de GitHub: https://github.com/gonreynoso/vivero-takumi
