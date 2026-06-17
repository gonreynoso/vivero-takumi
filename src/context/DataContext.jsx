import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { pedidosIniciales } from '../data/pedidos'
import { usuariosIniciales } from '../data/usuarios'
import { supabase } from '../lib/supabaseClient'

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
    return guardado ? JSON.parse(guardado) : estadoPorDefecto
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
    case 'SINCRONIZAR':
      return action.payload
    default:
      return state
  }
}

// Provee pedidos y usuarios (locales) además de plantas y categorías (Supabase)
export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, estadoInicial, cargarEstadoInicial)
  const [plantas, setPlantas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargandoPlantas, setCargandoPlantas] = useState(true)

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

  useEffect(() => {
    async function cargarDesdeSupabase() {
      const [{ data: plantasData, error: errorPlantas }, { data: categoriasData, error: errorCategorias }] =
        await Promise.all([
          supabase.from('plantas').select('*').order('id'),
          supabase.from('categorias').select('nombre').order('nombre'),
        ])
      if (errorPlantas) console.error('Error cargando plantas:', errorPlantas)
      if (errorCategorias) console.error('Error cargando categorías:', errorCategorias)
      setPlantas(plantasData ?? [])
      setCategorias((categoriasData ?? []).map((c) => c.nombre))
      setCargandoPlantas(false)
    }
    cargarDesdeSupabase()
  }, [])

  const agregarPlanta = async (planta) => {
    const { data, error } = await supabase.from('plantas').insert(planta).select().single()
    if (error) throw error
    setPlantas((prev) => [...prev, data])
  }

  const editarPlanta = async (planta) => {
    const { id, ...campos } = planta
    const { data, error } = await supabase
      .from('plantas')
      .update(campos)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setPlantas((prev) => prev.map((p) => (p.id === id ? data : p)))
  }

  const eliminarPlanta = async (id) => {
    const { error } = await supabase.from('plantas').delete().eq('id', id)
    if (error) throw error
    setPlantas((prev) => prev.filter((p) => p.id !== id))
  }

  const actualizarStock = async (id, stock) => {
    const { data, error } = await supabase
      .from('plantas')
      .update({ stock })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setPlantas((prev) => prev.map((p) => (p.id === id ? data : p)))
  }

  // Lee el stock actual desde el estado en memoria y lo descuenta en Supabase.
  // No es atómico (lee y después escribe) — aceptable para esta etapa sin backend propio.
  const descontarStock = async (items) => {
    const actualizaciones = items.map((item) => {
      const planta = plantas.find((p) => p.id === item.plantaId)
      const nuevoStock = Math.max(0, (planta?.stock ?? 0) - item.cantidad)
      return supabase.from('plantas').update({ stock: nuevoStock }).eq('id', item.plantaId).select().single()
    })
    const resultados = await Promise.all(actualizaciones)
    setPlantas((prev) =>
      prev.map((p) => {
        const actualizado = resultados.find((r) => r.data?.id === p.id)
        return actualizado?.data ? actualizado.data : p
      })
    )
  }

  const toggleHabilitada = async (id) => {
    const planta = plantas.find((p) => p.id === id)
    const { data, error } = await supabase
      .from('plantas')
      .update({ habilitada: planta?.habilitada === false })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setPlantas((prev) => prev.map((p) => (p.id === id ? data : p)))
  }

  const editarUsuario = (usuario) => dispatch({ type: 'EDITAR_USUARIO', payload: usuario })
  const eliminarUsuario = (id) => dispatch({ type: 'ELIMINAR_USUARIO', payload: id })

  const agregarPedido = (pedido) => dispatch({ type: 'AGREGAR_PEDIDO', payload: pedido })
  const actualizarEstadoPedido = (id, estado) =>
    dispatch({ type: 'ACTUALIZAR_ESTADO_PEDIDO', payload: { id, estado } })

  const agregarCategoria = async (nombre) => {
    const { error } = await supabase.from('categorias').insert({ nombre })
    if (error) throw error
    setCategorias((prev) => [...prev, nombre])
  }

  // El rename hace cascada a las plantas a nivel de base (FK con ON UPDATE CASCADE)
  const editarCategoria = async (anterior, nueva) => {
    const { error } = await supabase.from('categorias').update({ nombre: nueva }).eq('nombre', anterior)
    if (error) throw error
    setCategorias((prev) => prev.map((c) => (c === anterior ? nueva : c)))
    setPlantas((prev) => prev.map((p) => (p.categoria === anterior ? { ...p, categoria: nueva } : p)))
  }

  const eliminarCategoria = async (nombre) => {
    const { error } = await supabase.from('categorias').delete().eq('nombre', nombre)
    if (error) throw error
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
        editarUsuario,
        eliminarUsuario,
        agregarPedido,
        actualizarEstadoPedido,
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
