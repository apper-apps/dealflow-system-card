import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AnimatePresence } from 'framer-motion'
import Layout from './Layout'
import { routeArray } from '@/config/routes'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Layout />}>
              {routeArray.map((route) => (
                <Route
                  key={route.id}
                  path={route.path}
                  element={<route.component />}
                />
              ))}
            </Route>
          </Routes>
        </AnimatePresence>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-[9999]"
          toastClassName="rounded-lg shadow-lg"
        />
      </div>
    </BrowserRouter>
  )
}

export default App