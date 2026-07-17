# Vivero Takumi

Proyecto de **Plataformas de Desarrollo** (ACN4AV) — Final con frontend React + backend Express.

## Estructura

```
vivero-takumi/
├── frontend/          # SPA React (Vite) — puerto 5173
├── backend/           # API Express + MySQL — puerto 8888
├── FINAL.md           # Guía del final y demo
└── ENTREGA.md         # Documentación del TP
```

## Levantar en desarrollo

**1. MySQL** (una vez):
```bash
sudo mysql < backend/sql/setup-local.sql
cd backend && npm install && npm run seed
```

**2. Backend:**
```bash
cd backend
npm run dev
# http://localhost:8888 — Swagger: http://localhost:8888/api/docs
```

**3. Frontend:**
```bash
cd frontend
cp .env.example .env
pnpm install
pnpm dev
# http://localhost:5173
```

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Cliente | cliente@viverotakumi.com | cli123 |
| Empleado | empleado@viverotakumi.com | emp123 |
| Manager | manager@viverotakumi.com | manager123 |
| Admin | gonzalo.reynoso9@gmail.com | ver `backend/scripts/seed.js` |

## Repositorio

https://github.com/gonreynoso/vivero-takumi
