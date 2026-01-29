import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  CloudRain, 
  Sun,
  Cloud,
  CloudSun,
  CloudLightning,
  Snowflake,
  Eye,
  Compass,
  TrendingUp,
  RefreshCw,
  MapPin,
  Clock,
  Waves,
  CloudFog
} from 'lucide-react'
const API_URL = 'https://swd.weatherflow.com/swd/rest/observations/station/87740?token=a3c8bf20-eb9b-4570-b76f-9f3f6d2a41f2'

function celsiusToFahrenheit(c) {
  return c !== null && c !== undefined ? (c * 9/5 + 32).toFixed(1) : '--'
}

function mpsToMph(mps) {
  return mps !== null && mps !== undefined ? (mps * 2.237).toFixed(1) : '--'
}

function mbToInHg(mb) {
  return mb !== null && mb !== undefined ? (mb * 0.02953).toFixed(2) : '--'
}

function degToDirection(deg) {
  if (deg === null || deg === undefined) return '--'
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return directions[Math.round(deg / 22.5) % 16]
}

// Animated Weather Icons
function AnimatedSun({ size = 48 }) {
  return (
    <div className="relative animate-sun-pulse">
      <Sun size={size} className="text-yellow-400" />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-3 bg-yellow-400/50 rounded-full"
            style={{
              transform: `rotate(${i * 45}deg) translateY(-${size * 0.6}px)`,
            }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>
    </div>
  )
}

function AnimatedCloud({ size = 48 }) {
  return (
    <motion.div
      animate={{ x: [0, 4, 0, -4, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Cloud size={size} className="text-gray-400" />
    </motion.div>
  )
}

function AnimatedRain({ size = 48 }) {
  return (
    <div className="relative">
      <CloudRain size={size} className="text-blue-400" />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-0.5 h-3 bg-blue-400 rounded-full"
            animate={{ y: [0, 8], opacity: [1, 0] }}
            transition={{ 
              duration: 0.6, 
              repeat: Infinity, 
              delay: i * 0.15,
              ease: 'easeIn'
            }}
          />
        ))}
      </div>
    </div>
  )
}

function AnimatedStorm({ size = 48 }) {
  return (
    <div className="relative">
      <CloudLightning size={size} className="text-purple-400" />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, times: [0, 0.1, 0.15] }}
      >
        <div className="w-full h-full bg-yellow-400/30 blur-lg rounded-full" />
      </motion.div>
    </div>
  )
}

function AnimatedCloudSun({ size = 48 }) {
  return (
    <div className="relative">
      <motion.div
        className="absolute -top-1 -right-1"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Sun size={size * 0.5} className="text-yellow-400" />
      </motion.div>
      <motion.div
        animate={{ x: [0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Cloud size={size} className="text-gray-400" />
      </motion.div>
    </div>
  )
}

function getAnimatedWeatherIcon(conditions, size = 48) {
  if (!conditions) return <AnimatedSun size={size} />
  const lower = conditions.toLowerCase()
  if (lower.includes('thunder') || lower.includes('storm')) return <AnimatedStorm size={size} />
  if (lower.includes('rain') || lower.includes('precip')) return <AnimatedRain size={size} />
  if (lower.includes('cloud') && lower.includes('sun')) return <AnimatedCloudSun size={size} />
  if (lower.includes('cloud') || lower.includes('overcast')) return <AnimatedCloud size={size} />
  return <AnimatedSun size={size} />
}

// Real-time clock component
function RealTimeClock({ lastUpdate }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeSinceUpdate = lastUpdate 
    ? Math.floor((time - lastUpdate) / 1000)
    : null

  const formatTimeSince = (seconds) => {
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  return (
    <div className="flex items-center space-x-4 text-sm">
      <div className="flex items-center space-x-2 text-gray-400">
        <Clock size={16} />
        <span>{time.toLocaleTimeString()}</span>
      </div>
      {timeSinceUpdate !== null && (
        <div className="flex items-center space-x-2 text-gray-500">
          <span>•</span>
          <span>Updated {formatTimeSince(timeSinceUpdate)}</span>
        </div>
      )}
    </div>
  )
}

// Animated weather card
function WeatherCard({ icon: Icon, label, value, unit, subValue, gradient, delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card p-5 group"
    >
      <div className="flex items-start justify-between mb-3">
        <motion.div 
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Icon size={22} />
        </motion.div>
        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</span>
      </div>
      <motion.div 
        className="text-3xl font-bold mb-1"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: delay + 0.2 }}
      >
        {value}
        <span className="text-lg text-gray-400 ml-1 font-normal">{unit}</span>
      </motion.div>
      {subValue && (
        <div className="text-sm text-gray-500">{subValue}</div>
      )}
    </motion.div>
  )
}

// Loading skeleton card
function SkeletonCard() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-12 h-12 rounded-xl shimmer" />
        <div className="w-16 h-4 rounded shimmer" />
      </div>
      <div className="w-24 h-8 rounded shimmer mb-2" />
      <div className="w-20 h-4 rounded shimmer" />
    </div>
  )
}

export default function Weather() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [error, setError] = useState(null)

  const fetchWeather = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      
      // Fetch current conditions
      const res = await fetch(API_URL)
      const data = await res.json()
      
      if (data.obs && data.obs[0]) {
        setWeather(data.obs[0])
        setLastUpdate(new Date())
      }
    } catch (err) {
      console.error('Weather fetch error:', err)
      setError('Failed to load weather data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(() => fetchWeather(true), 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <main className="min-h-screen pt-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <CloudFog size={40} className="text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Weather Unavailable</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchWeather()}
              className="btn-primary px-6 py-3 rounded-xl inline-flex items-center space-x-2"
            >
              <RefreshCw size={18} />
              <span>Try Again</span>
            </motion.button>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
              <span className="gradient-text">Weather Station</span>
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-accent-primary" />
                <span>Ashburn, VA</span>
              </div>
              <RealTimeClock lastUpdate={lastUpdate} />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchWeather(true)}
            disabled={refreshing}
            className="mt-4 sm:mt-0 px-5 py-3 rounded-xl glass hover:bg-white/10 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <motion.div
              animate={refreshing ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: 'linear' }}
            >
              <RefreshCw size={18} />
            </motion.div>
            <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
          </motion.button>
        </motion.div>

        {loading && !weather ? (
          <div className="space-y-6">
            <div className="glass-card p-8 shimmer h-40" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ) : weather ? (
          <>
            {/* Current Conditions Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6 sm:p-10 mb-6 overflow-hidden relative"
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5" />
              
              <div className="relative flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center space-x-8 mb-6 md:mb-0">
                  {/* Animated weather icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.4, delay: 0.2 }}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center"
                  >
                    {getAnimatedWeatherIcon(weather.conditions, 56)}
                  </motion.div>
                  
                  <div>
                    <motion.div 
                      className="text-6xl sm:text-7xl md:text-8xl font-bold"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {celsiusToFahrenheit(weather.air_temperature)}
                      <span className="text-3xl text-gray-400">°F</span>
                    </motion.div>
                    <motion.div 
                      className="text-gray-400 text-lg mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Feels like {celsiusToFahrenheit(weather.feels_like)}°F
                    </motion.div>
                  </div>
                </div>
                
                <motion.div 
                  className="text-center md:text-right"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="text-2xl text-gray-200 mb-2 font-medium">
                    {weather.conditions || 'Clear'}
                  </div>
                  <div className="flex items-center justify-center md:justify-end space-x-4 text-gray-500">
                    <span>H: {celsiusToFahrenheit(weather.air_temperature)}°</span>
                    <span>L: {celsiusToFahrenheit(weather.dew_point)}°</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Weather Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              <WeatherCard
                icon={Droplets}
                label="Humidity"
                value={weather.relative_humidity || '--'}
                unit="%"
                gradient="from-blue-500 to-cyan-500"
                delay={0.1}
              />
              <WeatherCard
                icon={Wind}
                label="Wind"
                value={mpsToMph(weather.wind_avg)}
                unit="mph"
                subValue={`Gusts ${mpsToMph(weather.wind_gust)} mph ${degToDirection(weather.wind_direction)}`}
                gradient="from-teal-500 to-green-500"
                delay={0.15}
              />
              <WeatherCard
                icon={Gauge}
                label="Pressure"
                value={mbToInHg(weather.sea_level_pressure)}
                unit="inHg"
                subValue={weather.pressure_trend === 'rising' ? '↑ Rising' : weather.pressure_trend === 'falling' ? '↓ Falling' : '→ Steady'}
                gradient="from-purple-500 to-pink-500"
                delay={0.2}
              />
              <WeatherCard
                icon={CloudRain}
                label="Precipitation"
                value={(weather.precip_accum_local_day * 0.03937).toFixed(2) || '0.00'}
                unit="in"
                subValue="Today"
                gradient="from-indigo-500 to-blue-500"
                delay={0.25}
              />
              <WeatherCard
                icon={Sun}
                label="UV Index"
                value={weather.uv || '0'}
                unit=""
                subValue={weather.uv >= 8 ? 'Very High ⚠️' : weather.uv >= 6 ? 'High' : weather.uv >= 3 ? 'Moderate' : 'Low'}
                gradient="from-yellow-500 to-orange-500"
                delay={0.3}
              />
              <WeatherCard
                icon={Eye}
                label="Solar Radiation"
                value={weather.solar_radiation || '--'}
                unit="W/m²"
                gradient="from-orange-500 to-red-500"
                delay={0.35}
              />
              <WeatherCard
                icon={Thermometer}
                label="Dew Point"
                value={celsiusToFahrenheit(weather.dew_point)}
                unit="°F"
                gradient="from-cyan-500 to-blue-500"
                delay={0.4}
              />
              <WeatherCard
                icon={TrendingUp}
                label="Brightness"
                value={weather.brightness ? (weather.brightness / 1000).toFixed(1) : '--'}
                unit="klux"
                gradient="from-amber-500 to-yellow-500"
                delay={0.45}
              />
            </div>
          </>
        ) : null}

        {/* Station Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full glass text-gray-500 text-sm">
            <Waves size={16} className="text-accent-primary" />
            <span>WeatherFlow Tempest Station • Ashburn Roof Weather</span>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
