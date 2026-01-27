import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft, Ghost, Sparkles, RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

// Floating ghost animation
function FloatingGhost() {
  return (
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotate: [0, -5, 5, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="relative"
    >
      <div className="text-[150px] sm:text-[200px] leading-none opacity-20 select-none">
        👻
      </div>
      {/* Sparkle effects around ghost */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        >
          <Sparkles size={16} className="text-accent-primary" />
        </motion.div>
      ))}
    </motion.div>
  )
}

// Glitch text effect
function GlitchText({ children }) {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative inline-block">
      <span className={`${glitch ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
        {children}
      </span>
      {glitch && (
        <>
          <span className="absolute inset-0 text-cyan-400 translate-x-1 translate-y-0.5">
            {children}
          </span>
          <span className="absolute inset-0 text-pink-500 -translate-x-1 -translate-y-0.5">
            {children}
          </span>
        </>
      )}
    </div>
  )
}

// Terminal-style error message
function TerminalError() {
  const [lines, setLines] = useState([])
  const errorLines = [
    '$ cd /requested/page',
    'bash: cd: /requested/page: No such file or directory',
    '$ ls -la',
    'total 0',
    '$ echo "Looks like you\'re lost..."',
    'Looks like you\'re lost...',
    '$ suggest --help',
    '→ Try going back home',
  ]

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < errorLines.length) {
        setLines(prev => [...prev, errorLines[i]])
        i++
      } else {
        clearInterval(interval)
      }
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6 rounded-2xl max-w-lg mx-auto text-left font-mono text-sm"
    >
      <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-gray-500 text-xs">terminal</span>
      </div>
      <div className="space-y-1">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`${
              line.startsWith('$') 
                ? 'text-green-400' 
                : line.startsWith('bash:') || line.startsWith('→')
                ? 'text-yellow-400'
                : 'text-gray-400'
            }`}
          >
            {line}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-green-400 ml-1"
        />
      </div>
    </motion.div>
  )
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-2xl mx-auto">
        {/* Floating ghost */}
        <FloatingGhost />

        {/* 404 with glitch effect */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="text-8xl sm:text-9xl font-bold mb-4 gradient-text"
        >
          <GlitchText>404</GlitchText>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl sm:text-3xl font-semibold mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 mb-8 text-lg"
        >
          Looks like this page got lost in the void. <br />
          Even my servers don't know where it went.
        </motion.p>

        {/* Terminal error display */}
        <div className="mb-10">
          <TerminalError />
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2 glow"
            >
              <Home size={20} />
              <span>Go Home</span>
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="px-6 py-3 rounded-xl glass hover:bg-white/10 transition-all flex items-center space-x-2"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl glass hover:bg-white/10 transition-all flex items-center space-x-2"
          >
            <RefreshCw size={20} />
            <span>Retry</span>
          </motion.button>
        </motion.div>

        {/* Fun fact */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-gray-600 text-sm"
        >
          Fun fact: The 404 error code was named after room 404 at CERN where the original web servers were located.
          <br />
          <span className="text-gray-700">(Okay, that might not be true, but it's a fun story.)</span>
        </motion.p>
      </div>
    </main>
  )
}
