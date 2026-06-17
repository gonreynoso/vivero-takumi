import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext(null)

const estadoInicial = { items: [], seleccionados: [] }

// Al estilo Mercado Libre: cada item agregado queda seleccionado para la compra por defecto,
// y el comprador puede desmarcar items que quiera dejar en el carrito para después
function cartReducer(state, action) {
  switch (action.type) {
    case 'AGREGAR': {
      const existente = state.items.find((item) => item.plantaId === action.payload.id)
      if (existente) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.plantaId === action.payload.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          ),
        }
      }
      return {
        items: [
          ...state.items,
          {
            plantaId: action.payload.id,
            nombre: action.payload.nombre,
            precio: action.payload.precio,
            imagen: action.payload.imagen,
            categoria: action.payload.categoria,
            dificultad: action.payload.dificultad,
            cantidad: 1,
          },
        ],
        seleccionados: [...state.seleccionados, action.payload.id],
      }
    }
    case 'QUITAR':
      return {
        items: state.items.filter((item) => item.plantaId !== action.payload),
        seleccionados: state.seleccionados.filter((id) => id !== action.payload),
      }
    case 'QUITAR_VARIOS':
      return {
        items: state.items.filter((item) => !action.payload.includes(item.plantaId)),
        seleccionados: state.seleccionados.filter((id) => !action.payload.includes(id)),
      }
    case 'CAMBIAR_CANTIDAD':
      return {
        ...state,
        items: state.items.map((item) =>
          item.plantaId === action.payload.plantaId
            ? { ...item, cantidad: Math.max(1, action.payload.cantidad) }
            : item
        ),
      }
    case 'TOGGLE_SELECCION':
      return {
        ...state,
        seleccionados: state.seleccionados.includes(action.payload)
          ? state.seleccionados.filter((id) => id !== action.payload)
          : [...state.seleccionados, action.payload],
      }
    case 'SELECCIONAR_TODOS':
      return {
        ...state,
        seleccionados: action.payload ? state.items.map((item) => item.plantaId) : [],
      }
    case 'VACIAR':
      return estadoInicial
    default:
      return state
  }
}

// Provee el carrito de compras, vive en memoria durante toda la sesión
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, estadoInicial)
  const { items, seleccionados } = state

  const agregarAlCarrito = (planta) => dispatch({ type: 'AGREGAR', payload: planta })
  const quitarDelCarrito = (plantaId) => dispatch({ type: 'QUITAR', payload: plantaId })
  const quitarVarios = (plantaIds) => dispatch({ type: 'QUITAR_VARIOS', payload: plantaIds })
  const cambiarCantidad = (plantaId, cantidad) =>
    dispatch({ type: 'CAMBIAR_CANTIDAD', payload: { plantaId, cantidad } })
  const toggleSeleccion = (plantaId) => dispatch({ type: 'TOGGLE_SELECCION', payload: plantaId })
  const seleccionarTodos = (marcar) => dispatch({ type: 'SELECCIONAR_TODOS', payload: marcar })
  const vaciarCarrito = () => dispatch({ type: 'VACIAR' })

  const itemsSeleccionados = items.filter((item) => seleccionados.includes(item.plantaId))

  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0)
  const totalSeleccionado = itemsSeleccionados.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )
  const cantidadSeleccionada = itemsSeleccionados.reduce((acc, item) => acc + item.cantidad, 0)
  const todosSeleccionados = items.length > 0 && seleccionados.length === items.length

  return (
    <CartContext.Provider
      value={{
        items,
        seleccionados,
        itemsSeleccionados,
        agregarAlCarrito,
        quitarDelCarrito,
        quitarVarios,
        cambiarCantidad,
        toggleSeleccion,
        seleccionarTodos,
        vaciarCarrito,
        total,
        cantidadTotal,
        totalSeleccionado,
        cantidadSeleccionada,
        todosSeleccionados,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- el hook vive junto a su Provider a propósito
export function useCart() {
  return useContext(CartContext)
}
