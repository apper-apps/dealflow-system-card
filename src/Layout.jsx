import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '@/components/organisms/Header'
import Footer from '@/components/organisms/Footer'

const Layout = () => {
  const location = useLocation()
  const isDashboard = location.pathname.includes('/dashboard') || location.pathname.includes('/email-builder')

  if (isDashboard) {
    return (
      <div className="h-screen flex flex-col overflow-hidden bg-card">
        <motion.main 
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-y-auto"
        >
          <Outlet />
        </motion.main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <motion.main 
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}

export default Layout