# TP — Vivero Takumi

**Materia:** Plataformas de Desarrollo  
**Comisión:** ACN4AP  
**Formato de entrega:** `TP_NOMBRE_GRUPO.zip`

---

## Nombre del proyecto

**Vivero Takumi** — Tienda online y panel de gestión para un vivero de plantas.

---

## Integrantes

| Nombre          | Email                      |
| --------------- | -------------------------- |
| Gonzalo Reynoso | gonzalo.reynoso9@gmail.com |

---

## Temática

**Vivero de plantas** orientado a venta minorista y cuidado post-compra. La empresa es ficticia: un vivero local que recién digitaliza su catálogo y operaciones (no es una marca multinacional).

---

## Usuarios y roles

La aplicación define **cuatro roles** con permisos distintos:

| Rol          | Descripción               | Acceso principal                                          |
| ------------ | ------------------------- | --------------------------------------------------------- |
| **admin**    | Administrador del sistema | Dashboard, plantas, categorías, pedidos, usuarios         |
| **manager**  | Encargado del vivero      | Dashboard, plantas, categorías, pedidos                   |
| **empleado** | Personal de depósito      | Stock y pedidos (actualizar estados)                      |
| **cliente**  | Comprador registrado      | Catálogo, carrito, checkout, historial de compras y riego |

### Usuarios de prueba

| Rol      | Email                      | Contraseña                     |
| -------- | -------------------------- | ------------------------------ |
| Admin    | gonzalo.reynoso9@gmail.com | _(ver `src/data/usuarios.js`)_ |
| Manager  | manager@viverotakumi.com   | manager123                     |
| Empleado | empleado@viverotakumi.com  | emp123                         |
| Cliente  | cliente@viverotakumi.com   | cli123                         |

---

## Funcionalidades

### Requisitos de la consigna (cumplidos)

- [x] **Single Page Application** (React + Vite + React Router)
- [x] **Datos hardcodeados** en memoria / `localStorage` (sin API obligatoria)
- [x] **Login y logout** con sesión persistente en el navegador
- [x] **Gestión de usuarios** (alta, edición, baja, asignación de rol) — panel admin
- [x] **Al menos dos roles** — en la práctica, cuatro roles diferenciados
- [x] **Gestión de información por interfaz gráfica** — CRUD de plantas, categorías, pedidos y usuarios
- [x] **Componentes separados** — cada sección visual es un componente React reutilizable
- [x] **Solo frontend** — HTML, CSS y JavaScript (React). Sin PHP, Python ni .NET

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

| Capa         | Tecnología                      |
| ------------ | ------------------------------- |
| Framework    | React 19                        |
| Build        | Vite 8                          |
| Routing      | React Router 7                  |
| Estilos      | Tailwind CSS 3                  |
| Gráficos     | Recharts                        |
| Iconos       | Lucide React                    |
| Animaciones  | Motion                          |
| Persistencia | `localStorage` (datos y sesión) |

---

## Cómo ejecutar

```bash
pnpm install
pnpm dev
```

Abrir [http://localhost:5173]

### Build de producción

```bash
pnpm build
```

Los archivos compilados quedan en la carpeta `dist/`.

---

## Repositorio

**GitHub:** https://github.com/gonreynoso/vivero-takumi
