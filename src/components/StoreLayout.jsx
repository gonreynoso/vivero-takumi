import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileFloatingNav from './MobileFloatingNav'

// Layout para la tienda (home, catálogo, carrito, etc): navbar horizontal, sin sidebar
export default function StoreLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto p-3 sm:p-6 pb-24 md:pb-6 flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <MobileFloatingNav />
    </div>
  )
}
