# Vivero Takumi

SPA de e-commerce para un vivero de plantas. Proyecto de **Plataformas de Desarrollo** (ACN4AP).

## Descripción

Tienda online con catálogo, carrito, checkout y panel de administración. Los datos viven en memoria y `localStorage` (sin backend obligatorio). Incluye roles de usuario, gestión gráfica de plantas/categorías/pedidos/usuarios y funcionalidades propias del rubro: recomendador de plantas, guías de cuidado y seguimiento de riego.

## Requisitos

- Node.js 18+
- pnpm

## Instalación y desarrollo

```bash
pnpm install
pnpm dev
```

Abrir http://localhost:5173

## Build

```bash
pnpm build
pnpm preview
```

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Cliente | cliente@viverotakumi.com | cli123 |
| Empleado | empleado@viverotakumi.com | emp123 |
| Manager | manager@viverotakumi.com | manager123 |
| Admin | gonzalo.reynoso9@gmail.com | ver `src/data/usuarios.js` |

## Estructura principal

```
src/
├── components/     # UI reutilizable (Navbar, cards, formularios, etc.)
├── context/        # Auth, datos, carrito, tema, toasts
├── data/           # Seeds hardcodeados (plantas, usuarios, pedidos)
├── pages/          # Rutas: tienda, admin, empleado
├── routes/         # ProtectedRoute (guards por rol)
└── lib/            # Utilidades (imágenes, riego)
```

## Documentación de entrega

Ver [ENTREGA.md](./ENTREGA.md) para el documento completo del TP (temática, roles, funcionalidades, guía de exposición).

## Repositorio

https://github.com/gonreynoso/vivero-takumi
