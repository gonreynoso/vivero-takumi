import { createContext, useContext, useEffect, useReducer } from 'react'
import { pedidosIniciales } from '../data/pedidos'
import { usuariosIniciales } from '../data/usuarios'
import { categoriasIniciales, plantasIniciales } from '../data/plantas'

const DataContext = createContext(null)

const CLAVE_STORAGE = 'vivero-takumi:data'

const estadoInicial = {
  pedidos: pedidosIniciales,
  usuarios: usuariosIniciales,
  plantas: plantasIniciales,
  categorias: categoriasIniciales,
}

function normalizarEstado(guardado, estadoPorDefecto) {
  if (!guardado || typeof guardado !== 'object') return estadoPorDefecto
  return {
    pedidos: guardado.pedidos ?? estadoPorDefecto.pedidos,
    usuarios: guardado.usuarios ?? estadoPorDefecto.usuarios,
    plantas: guardado.plantas ?? estadoPorDefecto.plantas,
    categorias: guardado.categorias ?? estadoPorDefecto.categorias,
  }
}

function cargarEstadoInicial(estadoPorDefecto) {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE)
    if (!guardado) return estadoPorDefecto
    return normalizarEstado(JSON.parse(guardado), estadoPorDefecto)
  } catch {
    return estadoPorDefecto
  }
}

function dataReducer(state, action) {
  switch (action.type) {
    case 'AGREGAR_USUARIO': {
      const nuevoId = Math.max(0, ...state.usuarios.map((u) => u.id)) + 1
      return {
        ...state,
        usuarios: [...state.usuarios, { ...action.payload, id: nuevoId, rol: action.payload.rol || 'cliente' }],
      }
    }
    case 'EDITAR_USUARIO':
      return {
        ...state,
        usuarios: state.usuarios.map((u) =>
          u.id === action.payload.id ? { ...u, ...action.payload } : u
        ),
      }
    case 'ELIMINAR_USUARIO':
      return {
        ...state,
        usuarios: state.usuarios.filter((u) => u.id !== action.payload),
      }
    case 'AGREGAR_PEDIDO': {
      const nuevoId = Math.max(0, ...state.pedidos.map((p) => p.id)) + 1
      return {
        ...state,
        pedidos: [...state.pedidos, { ...action.payload, id: nuevoId }],
      }
    }
    case 'ACTUALIZAR_ESTADO_PEDIDO':
      return {
        ...state,
        pedidos: state.pedidos.map((p) =>
          p.id === action.payload.id ? { ...p, estado: action.payload.estado } : p
        ),
      }
    case 'EDITAR_PEDIDO':
      return {
        ...state,
        pedidos: state.pedidos.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      }
    case 'AGREGAR_PLANTA': {
      const nuevoId = Math.max(0, ...state.plantas.map((p) => p.id)) + 1
      return {
        ...state,
        plantas: [...state.plantas, { ...action.payload, id: nuevoId, habilitada: true }],
      }
    }
    case 'EDITAR_PLANTA':
      return {
        ...state,
        plantas: state.plantas.map((p) =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      }
    case 'ELIMINAR_PLANTA':
      return {
        ...state,
        plantas: state.plantas.filter((p) => p.id !== action.payload),
      }
    case 'ACTUALIZAR_STOCK':
      return {
        ...state,
        plantas: state.plantas.map((p) =>
          p.id === action.payload.id ? { ...p, stock: action.payload.stock } : p
        ),
      }
    case 'DESCONTAR_STOCK':
      return {
        ...state,
        plantas: state.plantas.map((p) => {
          const item = action.payload.find((i) => i.plantaId === p.id)
          if (!item) return p
          return { ...p, stock: Math.max(0, p.stock - item.cantidad) }
        }),
      }
    case 'TOGGLE_HABILITADA':
      return {
        ...state,
        plantas: state.plantas.map((p) =>
          p.id === action.payload ? { ...p, habilitada: p.habilitada === false } : p
        ),
      }
    case 'AGREGAR_CATEGORIA':
      return {
        ...state,
        categorias: [...state.categorias, action.payload],
      }
    case 'EDITAR_CATEGORIA':
      return {
        ...state,
        categorias: state.categorias.map((c) => (c === action.payload.anterior ? action.payload.nueva : c)),
        plantas: state.plantas.map((p) =>
          p.categoria === action.payload.anterior ? { ...p, categoria: action.payload.nueva } : p
        ),
      }
    case 'ELIMINAR_CATEGORIA':
      return {
        ...state,
        categorias: state.categorias.filter((c) => c !== action.payload),
      }
    case 'SINCRONIZAR':
      return normalizarEstado(action.payload, estadoInicial)
    default:
      return state
  }
}

export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, estadoInicial, cargarEstadoInicial)

  useEffect(() => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === CLAVE_STORAGE && e.newValue) {
        dispatch({ type: 'SINCRONIZAR', payload: JSON.parse(e.newValue) })
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const agregarUsuario = (usuario) => dispatch({ type: 'AGREGAR_USUARIO', payload: usuario })
  const editarUsuario = (usuario) => dispatch({ type: 'EDITAR_USUARIO', payload: usuario })
  const eliminarUsuario = (id) => dispatch({ type: 'ELIMINAR_USUARIO', payload: id })

  const agregarPedido = (pedido) => dispatch({ type: 'AGREGAR_PEDIDO', payload: pedido })
  const actualizarEstadoPedido = (id, estado) =>
    dispatch({ type: 'ACTUALIZAR_ESTADO_PEDIDO', payload: { id, estado } })


  const editarPedido = (pedido) => {
    const total = pedido.items
      ? pedido.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
      : pedido.total
    dispatch({ type: 'EDITAR_PEDIDO', payload: { ...pedido, total } })
  }

  const agregarPlanta = (planta) => dispatch({ type: 'AGREGAR_PLANTA', payload: planta })
  const editarPlanta = (planta) => dispatch({ type: 'EDITAR_PLANTA', payload: planta })
  const eliminarPlanta = (id) => dispatch({ type: 'ELIMINAR_PLANTA', payload: id })
  const actualizarStock = (id, stock) => dispatch({ type: 'ACTUALIZAR_STOCK', payload: { id, stock } })
  const descontarStock = (items) => dispatch({ type: 'DESCONTAR_STOCK', payload: items })
  const toggleHabilitada = (id) => dispatch({ type: 'TOGGLE_HABILITADA', payload: id })

  const agregarCategoria = (nombre) => dispatch({ type: 'AGREGAR_CATEGORIA', payload: nombre })
  const editarCategoria = (anterior, nueva) =>
    dispatch({ type: 'EDITAR_CATEGORIA', payload: { anterior, nueva } })
  const eliminarCategoria = (nombre) => dispatch({ type: 'ELIMINAR_CATEGORIA', payload: nombre })

  return (
    <DataContext.Provider
      value={{
        plantas: state.plantas,
        categorias: state.categorias,
        pedidos: state.pedidos,
        usuarios: state.usuarios,
        agregarUsuario,
        agregarPlanta,
        editarPlanta,
        eliminarPlanta,
        actualizarStock,
        descontarStock,
        toggleHabilitada,
        editarUsuario,
        eliminarUsuario,
        agregarPedido,
        actualizarEstadoPedido,
        editarPedido,
        agregarCategoria,
        editarCategoria,
        eliminarCategoria,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  return useContext(DataContext)
}
