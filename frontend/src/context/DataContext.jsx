import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import {
  plantasApi,
  categoriasApi,
  pedidosApi,
  usuariosApi,
  authApi,
} from '../lib/api'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { usuario } = useAuth()
  const [plantas, setPlantas] = useState([])
  const [categorias, setCategorias] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorApi, setErrorApi] = useState(null)

  const cargarDatos = useCallback(async () => {
    setCargando(true)
    setErrorApi(null)
    try {
      const [plantasRes, categoriasRes] = await Promise.all([
        plantasApi.list(),
        categoriasApi.list(),
      ])
      setPlantas(plantasRes.results)
      setCategorias(categoriasRes.results)

      if (usuario) {
        const pedidosRes = await pedidosApi.list()
        setPedidos(pedidosRes.results)

        if (usuario.rol === 'admin') {
          const usuariosRes = await usuariosApi.list()
          setUsuarios(usuariosRes.results)
        } else {
          setUsuarios([])
        }
      } else {
        setPedidos([])
        setUsuarios([])
      }
    } catch (error) {
      setErrorApi(error.message || 'Error al conectar con el API')
      setPlantas([])
      setCategorias([])
      setPedidos([])
      setUsuarios([])
    } finally {
      setCargando(false)
    }
  }, [usuario])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  useEffect(() => {
    const recheck = () => cargarDatos()
    window.addEventListener('focus', recheck)
    return () => window.removeEventListener('focus', recheck)
  }, [cargarDatos])

  const agregarUsuario = async (payload) => {
    if (usuario?.rol === 'admin') {
      const data = await usuariosApi.create(payload)
      setUsuarios((prev) => [...prev, data.usuario])
      return data.usuario
    }
    const data = await authApi.register(payload)
    return data.usuario
  }

  const editarUsuario = async (payload) => {
    if (usuario?.rol === 'admin') {
      const data = await usuariosApi.update(payload.id, payload)
      setUsuarios((prev) => prev.map((u) => (u.id === payload.id ? data.usuario : u)))
      return data.usuario
    }
    const data = await usuariosApi.updateProfile(payload)
    return data.usuario
  }

  const eliminarUsuario = async (id) => {
    await usuariosApi.remove(id)
    setUsuarios((prev) => prev.filter((u) => u.id !== id))
  }

  const agregarPedido = async (pedido) => {
    const data = await pedidosApi.create(pedido)
    setPedidos((prev) => [data.pedido, ...prev])
    const plantasRes = await plantasApi.list()
    setPlantas(plantasRes.results)
    return data.pedido
  }

  const actualizarEstadoPedido = async (id, estado) => {
    const data = await pedidosApi.updateEstado(id, estado)
    setPedidos((prev) => prev.map((p) => (p.id === id ? data.pedido : p)))
    return data.pedido
  }

  const editarPedido = async (pedido) => {
    const data = await pedidosApi.update(pedido.id, pedido)
    setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? data.pedido : p)))
    return data.pedido
  }

  const agregarPlanta = async (planta) => {
    const data = await plantasApi.create(planta)
    setPlantas((prev) => [...prev, data.planta])
    return data.planta
  }

  const editarPlanta = async (planta) => {
    const data = await plantasApi.update(planta.id, planta)
    setPlantas((prev) => prev.map((p) => (p.id === planta.id ? data.planta : p)))
    return data.planta
  }

  const eliminarPlanta = async (id) => {
    await plantasApi.remove(id)
    setPlantas((prev) => prev.filter((p) => p.id !== id))
  }

  const actualizarStock = async (id, stock) => {
    const data = await plantasApi.updateStock(id, stock)
    setPlantas((prev) => prev.map((p) => (p.id === id ? data.planta : p)))
    return data.planta
  }

  const descontarStock = async () => {
    const plantasRes = await plantasApi.list()
    setPlantas(plantasRes.results)
  }

  const toggleHabilitada = async (id) => {
    const data = await plantasApi.toggleHabilitada(id)
    setPlantas((prev) => prev.map((p) => (p.id === id ? data.planta : p)))
    return data.planta
  }

  const agregarCategoria = async (nombre) => {
    await categoriasApi.create(nombre)
    setCategorias((prev) => [...prev, nombre])
  }

  const editarCategoria = async (anterior, nueva) => {
    await categoriasApi.update(anterior, nueva)
    setCategorias((prev) => prev.map((c) => (c === anterior ? nueva : c)))
    setPlantas((prev) =>
      prev.map((p) => (p.categoria === anterior ? { ...p, categoria: nueva } : p))
    )
  }

  const eliminarCategoria = async (nombre) => {
    await categoriasApi.remove(nombre)
    setCategorias((prev) => prev.filter((c) => c !== nombre))
  }

  return (
    <DataContext.Provider
      value={{
        plantas,
        categorias,
        pedidos,
        usuarios,
        cargando,
        errorApi,
        recargar: cargarDatos,
        agregarUsuario,
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
        agregarPlanta,
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
