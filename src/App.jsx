import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense } from 'react'
import Navbar from './components/Navbar'
import ParticleBackground from './components/ParticleBackground'
import LoadingSpinner from './components/LoadingSpinner'
import Home from './pages/Home'

// Lazy load heavier pages
const Weather = lazy(() => import('./pages/Weather'))
const Radar = lazy(() => import('./pages/Radar'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

// Animated route wrapper
function AnimatedRoute({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  )
}

// Routes with animation
function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedRoute>
              <Home />
            </AnimatedRoute>
          }
        />
        <Route
          path="/weather"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatedRoute>
                <Weather />
              </AnimatedRoute>
            </Suspense>
          }
        />
        <Route
          path="/radar"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatedRoute>
                <Radar />
              </AnimatedRoute>
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatedRoute>
                <NotFound />
              </AnimatedRoute>
            </Suspense>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black relative">
        {/* Animated background */}
        <ParticleBackground />
        
        {/* Grain overlay for texture */}
        <div className="grain-overlay" />
        
        {/* Navigation */}
        <Navbar />
        
        {/* Main content */}
        <AnimatedRoutes />
      </div>
    </Router>
  )
}

export default App
