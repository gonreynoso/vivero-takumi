import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileFloatingNav from './MobileFloatingNav'
import ApiStatusBanner from './ApiStatusBanner'

export default function StoreLayout() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 flex flex-col">
      <ApiStatusBanner />
      <Navbar />
      <main className="max-w-7xl mx-auto p-3 sm:p-6 pb-24 md:pb-6 flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
      <MobileFloatingNav />
    </div>
  )
}
