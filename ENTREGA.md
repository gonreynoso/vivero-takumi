# TP Final — Vivero Takumi

**Materia:** Plataformas de Desarrollo  
**Comisión:** ACN4AV  
**Formato de entrega:** `TP_GONZALO_REYNOSO.zip`

---

## Nombre del proyecto

**Vivero Takumi** — Tienda online y panel de gestión para un vivero de plantas (frontend React + backend Express).

---

## Integrantes

| Nombre          | Email                      |
| --------------- | -------------------------- |
| Gonzalo Reynoso | gonzalo.reynoso9@gmail.com |

---

## Temática

**Vivero de plantas** orientado a venta minorista y cuidado post-compra. La empresa es ficticia: un vivero local que digitaliza catálogo, pedidos y gestión interna mediante una SPA y una API REST.

---

## Arquitectura

| Capa     | Ubicación   | Descripción                          |
| -------- | ----------- | ------------------------------------ |
| Frontend | `frontend/` | SPA React (Vite) — puerto 5173       |
| Backend  | `backend/`  | API Express + MySQL — puerto 8888    |

El frontend consume datos **solo vía REST** (`frontend/src/lib/api.js`). No accede a MySQL directamente.

---

## Requisitos del final (cumplidos)

| Requisito                    | Implementación                                              |
| ---------------------------- | ----------------------------------------------------------- |
| Mínimo 2 tipos de usuarios   | 4 roles: `admin`, `manager`, `empleado`, `cliente`          |
| Seguridad con access token   | JWT + bcrypt; `requireAuth` y `requireRole`                 |
| API REST                     | Express — auth, plantas, categorías, pedidos, usuarios      |
| Frontend y backend separados | Carpetas `frontend/` y `backend/`; dos procesos y puertos    |
| Persistencia en servidor     | MySQL 8 (`backend/sql/schema.sql`)                          |

---

## Usuarios y roles

| Rol          | Descripción               | Acceso principal                                          |
| ------------ | ------------------------- | --------------------------------------------------------- |
| **admin**    | Administrador del sistema | Dashboard, plantas, categorías, pedidos, usuarios         |
| **manager**  | Encargado del vivero      | Dashboard, plantas, categorías, pedidos                   |
| **empleado** | Personal de depósito      | Stock y pedidos (actualizar estados)                      |
| **cliente**  | Comprador registrado      | Catálogo, carrito, checkout, historial de compras y riego |

### Usuarios de prueba

| Rol      | Email                      | Contraseña                          |
| -------- | -------------------------- | ----------------------------------- |
| Admin    | gonzalo.reynoso9@gmail.com | _(ver `backend/scripts/seed.js`)_   |
| Manager  | manager@viverotakumi.com   | manager123                          |
| Empleado | empleado@viverotakumi.com  | emp123                              |
| Cliente  | cliente@viverotakumi.com   | cli123                              |

---

## Funcionalidades

### Requisitos de la consigna

- [x] **Single Page Application** (React + Vite + React Router)
- [x] **API REST** con Express, MySQL y arquitectura MVC
- [x] **Autenticación JWT** (access + refresh) y bcrypt en contraseñas
- [x] **Login, registro y logout** con sesión persistente
- [x] **Gestión de usuarios** (alta, edición, baja, asignación de rol) — panel admin
- [x] **Cuatro roles** diferenciados
- [x] **CRUD por interfaz gráfica** — plantas, categorías, pedidos y usuarios
- [x] **Componentes separados** — componentes React reutilizables
- [x] **Frontend y backend desacoplados** — CORS + fetch al API
- [x] **Documentación Swagger** en `/api/docs`

### Funcionalidades adicionales (originalidad)

**Tienda (cliente / invitado)**

- Home con hero, categorías, productos destacados, beneficios, testimonios y FAQ
- Catálogo con búsqueda y filtros (categoría, dificultad, precio)
- Detalle de planta con galería, guía de cuidado y stock
- Recomendador de plantas (quiz interactivo)
- Carrito de compras con selección de ítems
- Checkout con envío a domicilio o retiro en local
- Registro de nuevos clientes
- **Mis compras**: historial de pedidos + seguimiento de riego post-compra
- Modo oscuro
- Diseño responsive con navegación móvil

**Panel administrativo**

- Dashboard con KPIs y gráficos (ventas, pedidos, stock bajo)
- CRUD de plantas (imágenes, guía de cuidado, habilitar/deshabilitar)
- CRUD de categorías
- Gestión de pedidos (estados: pendiente → confirmado → entregado)
- Gestión de usuarios (solo admin)

**Panel empleado**

- Vista y actualización de stock
- Gestión de pedidos (cambio de estado)

---

## Tecnologías

### Frontend

| Capa         | Tecnología           |
| ------------ | -------------------- |
| Framework    | React 19             |
| Build        | Vite 8               |
| Routing      | React Router 7       |
| Estilos      | Tailwind CSS 3       |
| Gráficos     | Recharts             |
| Cliente HTTP | fetch (`lib/api.js`) |

### Backend

| Capa            | Tecnología                    |
| --------------- | ----------------------------- |
| Runtime         | Node.js 18+                   |
| Framework       | Express 5                     |
| Base de datos   | MySQL 8 (mysql2)              |
| Autenticación   | jsonwebtoken + bcrypt         |
| CORS            | cors                          |
| Documentación   | swagger-ui-express            |

---

## Cómo ejecutar

### 1. Base de datos (una vez)

```bash
sudo mysql < backend/sql/setup-local.sql
cd backend && cp .env.example .env && npm install && npm run seed
```

### 2. Backend

```bash
cd backend
npm run dev
```

API: [http://localhost:8888](http://localhost:8888) — Swagger: [http://localhost:8888/api/docs](http://localhost:8888/api/docs)

### 3. Frontend

```bash
cd frontend
cp .env.example .env
pnpm install
pnpm dev
```

SPA: [http://localhost:5173](http://localhost:5173)

---

## Entrega ZIP

```
TP_GONZALO_REYNOSO.zip
├── TP_GONZALO_REYNOSO.docx
├── frontend/
└── backend/
```

```bash
zip -r TP_GONZALO_REYNOSO.zip TP_GONZALO_REYNOSO.docx frontend backend \
  -x "frontend/node_modules/*" -x "backend/node_modules/*" -x "frontend/dist/*"
```

---

## Repositorio

**GitHub:** https://github.com/gonreynoso/vivero-takumi
