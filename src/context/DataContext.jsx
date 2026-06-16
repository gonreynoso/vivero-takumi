import { createContext, useContext, useReducer } from 'react'
import { plantasIniciales } from '../data/plantas'
import { pedidosIniciales } from '../data/pedidos'
import { usuariosIniciales } from '../data/usuarios'

const DataContext = createContext(null)

const estadoInicial = {
  plantas: plantasIniciales,
  pedidos: pedidosIniciales,
  usuarios: usuariosIniciales,
}

function dataReducer(state, action) {
  switch (action.type) {
    case 'AGREGAR_PLANTA': {
      const nuevoId = Math.max(0, ...state.plantas.map((p) => p.id)) + 1
      return {
        ...state,
        plantas: [...state.plantas, { ...action.payload, id: nuevoId }],
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
          return item ? { ...p, stock: Math.max(0, p.stock - item.cantidad) } : p
        }),
      }
    case 'AGREGAR_USUARIO': {
      const nuevoId = Math.max(0, ...state.usuarios.map((u) => u.id)) + 1
      return {
        ...state,
        usuarios: [...state.usuarios, { ...action.payload, id: nuevoId }],
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
    default:
      return state
  }
}

// Provee plantas, pedidos y usuarios junto con las acciones para modificarlos
export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, estadoInicial)

  const agregarPlanta = (planta) => dispatch({ type: 'AGREGAR_PLANTA', payload: planta })
  const editarPlanta = (planta) => dispatch({ type: 'EDITAR_PLANTA', payload: planta })
  const eliminarPlanta = (id) => dispatch({ type: 'ELIMINAR_PLANTA', payload: id })
  const actualizarStock = (id, stock) =>
    dispatch({ type: 'ACTUALIZAR_STOCK', payload: { id, stock } })
  const descontarStock = (items) => dispatch({ type: 'DESCONTAR_STOCK', payload: items })

  const agregarUsuario = (usuario) => dispatch({ type: 'AGREGAR_USUARIO', payload: usuario })
  const editarUsuario = (usuario) => dispatch({ type: 'EDITAR_USUARIO', payload: usuario })
  const eliminarUsuario = (id) => dispatch({ type: 'ELIMINAR_USUARIO', payload: id })

  const agregarPedido = (pedido) => dispatch({ type: 'AGREGAR_PEDIDO', payload: pedido })
  const actualizarEstadoPedido = (id, estado) =>
    dispatch({ type: 'ACTUALIZAR_ESTADO_PEDIDO', payload: { id, estado } })

  return (
    <DataContext.Provider
      value={{
        plantas: state.plantas,
        pedidos: state.pedidos,
        usuarios: state.usuarios,
        agregarPlanta,
        editarPlanta,
        eliminarPlanta,
        actualizarStock,
        descontarStock,
        agregarUsuario,
        editarUsuario,
        eliminarUsuario,
        agregarPedido,
        actualizarEstadoPedido,
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
