import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { pedidosIniciales } from '../data/pedidos'
import { usuariosIniciales } from '../data/usuarios'
import { plantasIniciales } from '../data/plantas'
import { categoriasIniciales } from '../data/categorias'

const DataContext = createContext(null)

const CLAVE_STORAGE = 'vivero-takumi:data'

const estadoInicial = {
  pedidos: pedidosIniciales,
  usuarios: usuariosIniciales,
}

// Hidrata desde localStorage si existe (persiste entre recargas y se sincroniza entre pestañas,
// ya que pedidos y usuarios todavía no viven en una base de datos real)
function cargarEstadoInicial(estadoPorDefecto) {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE)
    if (!guardado) return estadoPorDefecto
    const estado = JSON.parse(guardado)
    // Navegadores con datos cacheados de antes de migrar el super admin a Supabase
    // todavía pueden tener este usuario hardcodeado guardado localmente; se descarta acá.
    estado.usuarios = (estado.usuarios || []).filter((u) => u.email !== 'admin@viverotakumi.com')
    return estado
  } catch {
    return estadoPorDefecto
  }
}

function dataReducer(state, action) {
  switch (action.type) {
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
    case 'AGREGAR_USUARIO': {
      const nuevoId = Math.max(0, ...state.usuarios.map((u) => u.id)) + 1
      return {
        ...state,
        usuarios: [...state.usuarios, { ...action.payload, id: nuevoId }],
      }
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
    case 'SINCRONIZAR':
      return action.payload
    default:
      return state
  }
}

// Provee pedidos, usuarios, plantas y categorías — todo en memoria (sin backend)
export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, estadoInicial, cargarEstadoInicial)
  const [plantas, setPlantas] = useState(plantasIniciales)
  const [categorias, setCategorias] = useState(categoriasIniciales)
  const cargandoPlantas = false

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

  const agregarPlanta = (planta) => {
    const nuevoId = Math.max(0, ...plantas.map((p) => p.id)) + 1
    setPlantas((prev) => [...prev, { ...planta, id: nuevoId, habilitada: true }])
  }

  const editarPlanta = (planta) => {
    setPlantas((prev) => prev.map((p) => (p.id === planta.id ? { ...p, ...planta } : p)))
  }

  const eliminarPlanta = (id) => {
    setPlantas((prev) => prev.filter((p) => p.id !== id))
  }

  const actualizarStock = (id, stock) => {
    setPlantas((prev) => prev.map((p) => (p.id === id ? { ...p, stock } : p)))
  }

  const descontarStock = (items) => {
    setPlantas((prev) =>
      prev.map((p) => {
        const item = items.find((i) => i.plantaId === p.id)
        if (!item) return p
        return { ...p, stock: Math.max(0, p.stock - item.cantidad) }
      })
    )
  }

  const toggleHabilitada = (id) => {
    setPlantas((prev) => prev.map((p) => (p.id === id ? { ...p, habilitada: !p.habilitada } : p)))
  }

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

  const agregarCategoria = (nombre) => {
    setCategorias((prev) => [...prev, nombre])
  }

  const editarCategoria = (anterior, nueva) => {
    setCategorias((prev) => prev.map((c) => (c === anterior ? nueva : c)))
    setPlantas((prev) => prev.map((p) => (p.categoria === anterior ? { ...p, categoria: nueva } : p)))
  }

  const eliminarCategoria = (nombre) => {
    setCategorias((prev) => prev.filter((c) => c !== nombre))
  }

  return (
    <DataContext.Provider
      value={{
        plantas,
        categorias,
        cargandoPlantas,
        pedidos: state.pedidos,
        usuarios: state.usuarios,
        agregarPlanta,
        editarPlanta,
        eliminarPlanta,
        actualizarStock,
        descontarStock,
        toggleHabilitada,
        agregarUsuario,
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

// eslint-disable-next-line react-refresh/only-export-components -- el hook vive junto a su Provider a propósito
export function useData() {
  return useContext(DataContext)
}
