# Backend — Vivero Takumi API

API REST con **Express + MySQL** (sin Docker).

## Requisitos

- Node.js 18+
- MySQL 8 (servicio local en puerto 3306)

## 1. Crear base de datos y usuario

Abrí MySQL como administrador. En Ubuntu/Debian:

```bash
sudo mysql
```

Pegá y ejecutá el contenido de `sql/setup-local.sql`, o directamente:

```bash
sudo mysql < sql/setup-local.sql
```

Eso crea:

- Base: `vivero_takumi`
- Usuario: `vivero` / contraseña: `vivero123`

Si preferís otro usuario o contraseña, cambiá `setup-local.sql` y `backend/.env` para que coincidan.

## 2. Configurar entorno

```bash
cd backend
cp .env.example .env
npm install
```

Editá `.env` solo si cambiaste usuario/contraseña de MySQL.

## 3. Cargar datos iniciales

```bash
npm run seed
```

## 4. Iniciar API

```bash
npm run dev
```

API en **http://localhost:8888** — probá: `curl http://localhost:8888/api/health`

**Swagger UI:** http://localhost:8888/api/docs

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor con recarga automática |
| `npm run start` | Servidor sin watch |
| `npm run seed` | Usuarios, plantas, categorías y pedidos demo |

## Estructura (MVC)

```
src/
├── routes/        # URLs
├── controllers/   # Lógica HTTP
├── models/        # Consultas MySQL
├── middlewares/   # JWT (requireAuth, requireRole)
└── helpers/
```

## Autenticación

Login devuelve `accessToken` (15 min) y `refreshToken` (7 días).

```
Authorization: Bearer <accessToken>
```

Renovar access token:

```
GET /api/auth/refresh-token
Authorization: Bearer <refreshToken>
```
