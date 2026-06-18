import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Layout from './components/Layout'
import StoreLayout from './components/StoreLayout'
import ScrollToTop from './components/ScrollToTop'

import Login from './pages/Login'
import Registro from './pages/Registro'
import Home from './pages/Home'
import Nosotros from './pages/Nosotros'
import Contacto from './pages/Contacto'

import Dashboard from './pages/admin/Dashboard'
import PlantasAdmin from './pages/admin/Plantas'
import CategoriasAdmin from './pages/admin/Categorias'
import Usuarios from './pages/admin/Usuarios'
import PedidosAdmin from './pages/admin/Pedidos'

import Stock from './pages/empleado/Stock'
import PedidosEmpleado from './pages/empleado/Pedidos'

import Catalogo from './pages/cliente/Catalogo'
import DetallePlanta from './pages/cliente/DetallePlanta'
import Carrito from './pages/cliente/Carrito'
import Checkout from './pages/cliente/Checkout'
import PedidoConfirmado from './pages/cliente/PedidoConfirmado'
import MisPedidos from './pages/cliente/MisPedidos'

// Define toda la navegación de la app y los guards de rol por sección
function AppRoutes() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      <Route element={<ProtectedRoute rolesPermitidos={['admin', 'manager']} />}>
        <Route element={<Layout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/plantas" element={<PlantasAdmin />} />
          <Route path="/admin/categorias" element={<CategoriasAdmin />} />
          <Route path="/admin/pedidos" element={<PedidosAdmin />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute rolesPermitidos={['admin']} />}>
        <Route element={<Layout />}>
          <Route path="/admin/usuarios" element={<Usuarios />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute rolesPermitidos={['empleado']} />}>
        <Route element={<Layout />}>
          <Route path="/empleado/stock" element={<Stock />} />
          <Route path="/empleado/pedidos" element={<PedidosEmpleado />} />
        </Route>
      </Route>

      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/planta/:id" element={<DetallePlanta />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pedido-confirmado" element={<PedidoConfirmado />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/contacto" element={<Contacto />} />
      </Route>

      <Route element={<ProtectedRoute rolesPermitidos={['cliente']} />}>
        <Route element={<StoreLayout />}>
          <Route path="/mis-pedidos" element={<MisPedidos />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </DataProvider>
    </BrowserRouter>
  )
}
