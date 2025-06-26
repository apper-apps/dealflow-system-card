import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { routes } from '@/config/routes'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const navItems = Object.values(routes).filter(route => route.showInNav)

  const handleDashboardAccess = () => {
    navigate('/dashboard')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DealFlow Hub</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`
                }
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon="Settings"
              onClick={handleDashboardAccess}
            >
              Dashboard
            </Button>
            <Button variant="primary" size="sm" icon="Plus">
              Submit Deal
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50"
          >
            <ApperIcon name={isMobileMenuOpen ? 'X' : 'Menu'} className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 md:hidden"
            >
              <div className="container mx-auto px-4 py-4">
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive
                            ? 'text-primary bg-primary/10'
                            : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                        }`
                      }
                    >
                      <ApperIcon name={item.icon} className="w-5 h-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
                
                <div className="pt-4 mt-4 border-t border-gray-200 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    icon="Settings"
                    onClick={() => {
                      handleDashboardAccess()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full justify-start"
                    icon="Plus"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Submit Deal
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header