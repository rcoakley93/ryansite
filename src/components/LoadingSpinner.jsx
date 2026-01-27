import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className="w-16 h-16 border-4 border-accent-primary/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Inner spinning gradient ring */}
        <motion.div
          className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-accent-primary border-r-accent-secondary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Center dot */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary" />
        </motion.div>
      </div>
      
      {/* Loading text */}
      <motion.p
        className="absolute mt-28 text-gray-500 text-sm tracking-wider"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        Loading...
      </motion.p>
    </div>
  )
}
