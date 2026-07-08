module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'Vivero Takumi API',
    description:
      'API REST del final — Plataformas de Desarrollo. Autenticación JWT (Bearer). Usuarios de prueba: cliente@viverotakumi.com / cli123',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:8888', description: 'Desarrollo local' }],
  tags: [
    { name: 'Health', description: 'Estado del servidor' },
    { name: 'Auth', description: 'Registro, login y tokens' },
    { name: 'Plantas', description: 'Catálogo de plantas' },
    { name: 'Categorías', description: 'Categorías del catálogo' },
    { name: 'Pedidos', description: 'Pedidos de clientes' },
    { name: 'Usuarios', description: 'Gestión de usuarios (admin)' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token obtenido en POST /api/auth/login',
      },
    },
    schemas: {
      SuccessMessage: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string' },
        },
      },
      LoginBody: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'cliente@viverotakumi.com' },
          password: { type: 'string', example: 'cli123' },
        },
      },
      RegisterBody: {
        type: 'object',
        required: ['nombre', 'email', 'password'],
        properties: {
          nombre: { type: 'string', example: 'Juan Pérez' },
          email: { type: 'string', example: 'juan@mail.com' },
          password: { type: 'string', example: 'abc123' },
        },
      },
      Planta: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nombre: { type: 'string' },
          categoria: { type: 'string' },
          precio: { type: 'number' },
          stock: { type: 'integer' },
          imagen: { type: 'string' },
          dificultad: { type: 'string' },
          descripcion: { type: 'string' },
          guia_cuidado: { type: 'object' },
          rating: { type: 'number' },
          habilitada: { type: 'boolean' },
        },
      },
      Pedido: {
        type: 'object',
        properties: {
          clienteEmail: { type: 'string' },
          clienteNombre: { type: 'string' },
          clienteTelefono: { type: 'string' },
          clienteDni: { type: 'string' },
          clienteDireccion: { type: 'string' },
          clienteCiudad: { type: 'string' },
          items: { type: 'array', items: { type: 'object' } },
          total: { type: 'number' },
          estado: {
            type: 'string',
            enum: ['pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado'],
          },
          metodoEnvio: { type: 'string' },
          fecha: { type: 'string', format: 'date' },
        },
      },
    },
  },
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          200: {
            description: 'API operativa',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar cliente',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterBody' } } },
        },
        responses: { 201: { description: 'Usuario creado' }, 409: { description: 'Email duplicado' } },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        description: 'Devuelve accessToken (15 min) y refreshToken (7 días)',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } } },
        },
        responses: { 200: { description: 'Login exitoso con tokens' }, 401: { description: 'Credenciales incorrectas' } },
      },
    },
    '/api/auth/refresh-token': {
      get: {
        tags: ['Auth'],
        summary: 'Renovar access token',
        description: 'Enviar refresh token en Authorization: Bearer ...',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Nuevo accessToken' }, 401: { description: 'Token inválido' } },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Datos del usuario' }, 401: { description: 'Sin token' } },
      },
    },
    '/api/plantas': {
      get: {
        tags: ['Plantas'],
        summary: 'Listar plantas',
        description: 'Público. Con token staff ve también deshabilitadas.',
        responses: {
          200: {
            description: 'Lista de plantas',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    results: { type: 'array', items: { $ref: '#/components/schemas/Planta' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Plantas'],
        summary: 'Crear planta',
        security: [{ bearerAuth: [] }],
        description: 'Roles: admin, manager',
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Planta' } } } },
        responses: { 201: { description: 'Planta creada' }, 403: { description: 'Sin permiso' } },
      },
    },
    '/api/plantas/{ID}': {
      get: {
        tags: ['Plantas'],
        summary: 'Obtener planta por ID',
        parameters: [{ name: 'ID', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Planta encontrada' }, 404: { description: 'No existe' } },
      },
      put: {
        tags: ['Plantas'],
        summary: 'Actualizar planta',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'ID', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Actualizada' } },
      },
      delete: {
        tags: ['Plantas'],
        summary: 'Eliminar planta',
        security: [{ bearerAuth: [] }],
        description: 'Rol: admin',
        parameters: [{ name: 'ID', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Eliminada' } },
      },
    },
    '/api/plantas/{ID}/stock': {
      patch: {
        tags: ['Plantas'],
        summary: 'Actualizar stock',
        security: [{ bearerAuth: [] }],
        description: 'Roles: admin, manager, empleado',
        parameters: [{ name: 'ID', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { stock: { type: 'integer' } } },
            },
          },
        },
        responses: { 200: { description: 'Stock actualizado' } },
      },
    },
    '/api/plantas/{ID}/habilitada': {
      patch: {
        tags: ['Plantas'],
        summary: 'Alternar habilitada/deshabilitada',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'ID', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Estado actualizado' } },
      },
    },
    '/api/categorias': {
      get: {
        tags: ['Categorías'],
        summary: 'Listar categorías',
        responses: { 200: { description: 'Array de nombres' } },
      },
      post: {
        tags: ['Categorías'],
        summary: 'Crear categoría',
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { nombre: { type: 'string' } } },
            },
          },
        },
        responses: { 201: { description: 'Creada' } },
      },
    },
    '/api/categorias/{nombre}': {
      put: {
        tags: ['Categorías'],
        summary: 'Renombrar categoría',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'nombre', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { nueva: { type: 'string' } } },
            },
          },
        },
        responses: { 200: { description: 'Renombrada' } },
      },
      delete: {
        tags: ['Categorías'],
        summary: 'Eliminar categoría',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'nombre', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Eliminada' } },
      },
    },
    '/api/pedidos': {
      get: {
        tags: ['Pedidos'],
        summary: 'Listar pedidos',
        security: [{ bearerAuth: [] }],
        description: 'Cliente ve solo los suyos; staff ve todos',
        responses: { 200: { description: 'Lista de pedidos' }, 401: { description: 'Sin token' } },
      },
      post: {
        tags: ['Pedidos'],
        summary: 'Crear pedido',
        description: 'Público (checkout invitado o logueado). Descuenta stock.',
        requestBody: {
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Pedido' } } },
        },
        responses: { 201: { description: 'Pedido creado' } },
      },
    },
    '/api/pedidos/{ID}': {
      get: {
        tags: ['Pedidos'],
        summary: 'Obtener pedido',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'ID', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Pedido' }, 403: { description: 'Sin permiso' } },
      },
      put: {
        tags: ['Pedidos'],
        summary: 'Editar pedido',
        security: [{ bearerAuth: [] }],
        description: 'Rol: admin',
        parameters: [{ name: 'ID', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Actualizado' } },
      },
    },
    '/api/pedidos/{ID}/estado': {
      patch: {
        tags: ['Pedidos'],
        summary: 'Cambiar estado del pedido',
        security: [{ bearerAuth: [] }],
        description: 'Roles: admin, manager, empleado',
        parameters: [{ name: 'ID', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  estado: {
                    type: 'string',
                    enum: ['pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado'],
                  },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Estado actualizado' } },
      },
    },
    '/api/usuarios': {
      get: {
        tags: ['Usuarios'],
        summary: 'Listar usuarios',
        security: [{ bearerAuth: [] }],
        description: 'Rol: admin',
        responses: { 200: { description: 'Lista' }, 403: { description: 'Sin permiso' } },
      },
      post: {
        tags: ['Usuarios'],
        summary: 'Crear usuario',
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: 'Creado' } },
      },
    },
    '/api/usuarios/{ID}': {
      put: {
        tags: ['Usuarios'],
        summary: 'Actualizar usuario',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'ID', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Actualizado' } },
      },
      delete: {
        tags: ['Usuarios'],
        summary: 'Eliminar usuario',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'ID', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Eliminado' } },
      },
    },
    '/api/perfil': {
      patch: {
        tags: ['Usuarios'],
        summary: 'Actualizar perfil propio',
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: 'Perfil actualizado' } },
      },
    },
  },
}
