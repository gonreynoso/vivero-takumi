import { createContext, useContext, useReducer } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'AGREGAR': {
      const existente = state.find((item) => item.plantaId === action.payload.id)
      if (existente) {
        return state.map((item) =>
          item.plantaId === action.payload.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [
        ...state,
        {
          plantaId: action.payload.id,
          nombre: action.payload.nombre,
          precio: action.payload.precio,
          imagen: action.payload.imagen,
          cantidad: 1,
        },
      ]
    }
    case 'QUITAR':
      return state.filter((item) => item.plantaId !== action.payload)
    case 'CAMBIAR_CANTIDAD':
      return state.map((item) =>
        item.plantaId === action.payload.plantaId
          ? { ...item, cantidad: Math.max(1, action.payload.cantidad) }
          : item
      )
    case 'VACIAR':
      return []
    default:
      return state
  }
}

// Provee el carrito de compras, vive en memoria durante toda la sesión
export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [])

  const agregarAlCarrito = (planta) => dispatch({ type: 'AGREGAR', payload: planta })
  const quitarDelCarrito = (plantaId) => dispatch({ type: 'QUITAR', payload: plantaId })
  const cambiarCantidad = (plantaId, cantidad) =>
    dispatch({ type: 'CAMBIAR_CANTIDAD', payload: { plantaId, cantidad } })
  const vaciarCarrito = () => dispatch({ type: 'VACIAR' })

  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        agregarAlCarrito,
        quitarDelCarrito,
        cambiarCantidad,
        vaciarCarrito,
        total,
        cantidadTotal,
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
