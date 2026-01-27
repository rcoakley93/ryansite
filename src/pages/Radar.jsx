import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { 
  Plane, Radio, Activity, TrendingUp, Gauge, Navigation,
  ArrowUp, ArrowDown, Minus, RefreshCw, Maximize2, Info
} from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Ryan's location (Loudoun Valley Estates, VA)
const HOME_POSITION = [39.0458, -77.4875]
const RANGE_RINGS = [50, 100, 150, 200, 250] // nautical miles

// Calculate distance in nautical miles using Haversine formula
function calculateDistanceNM(lat1, lon1, lat2, lon2) {
  const R = 3440.065 // Earth's radius in nautical miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Sample aircraft data - will be replaced with real feed
const generateSampleAircraft = () => [
  {
    hex: 'A12345',
    flight: 'UAL1234',
    lat: 39.15,
    lon: -77.35,
    altitude: 35000,
    speed: 485,
    track: 245,
    vert_rate: 0,
    squawk: '1200',
    aircraft_type: 'B738',
    messages: 1250,
    seen: 0.5,
  },
  {
    hex: 'A67890',
    flight: 'DAL567',
    lat: 38.85,
    lon: -77.65,
    altitude: 28000,
    speed: 420,
    track: 65,
    vert_rate: -1200,
    squawk: '4523',
    aircraft_type: 'A320',
    messages: 890,
    seen: 1.2,
  },
  {
    hex: 'ABCDEF',
    flight: 'AAL890',
    lat: 39.25,
    lon: -77.15,
    altitude: 41000,
    speed: 520,
    track: 180,
    vert_rate: 0,
    squawk: '7234',
    aircraft_type: 'B77W',
    messages: 2100,
    seen: 0.3,
  },
  {
    hex: 'A11111',
    flight: 'SWA432',
    lat: 38.95,
    lon: -77.85,
    altitude: 18000,
    speed: 340,
    track: 310,
    vert_rate: 2500,
    squawk: '1234',
    aircraft_type: 'B737',
    messages: 450,
    seen: 2.1,
  },
  {
    hex: 'A22222',
    flight: 'N12345',
    lat: 39.08,
    lon: -77.52,
    altitude: 4500,
    speed: 120,
    track: 90,
    vert_rate: 500,
    squawk: '1200',
    aircraft_type: 'C172',
    messages: 120,
    seen: 0.8,
  },
  {
    hex: 'A33333',
    flight: 'JBU101',
    lat: 38.75,
    lon: -77.25,
    altitude: 32000,
    speed: 460,
    track: 25,
    vert_rate: 0,
    squawk: '5567',
    aircraft_type: 'A321',
    messages: 1800,
    seen: 0.2,
  },
  {
    hex: 'A44444',
    flight: 'FDX892',
    lat: 39.35,
    lon: -77.95,
    altitude: 38000,
    speed: 510,
    track: 135,
    vert_rate: -800,
    squawk: '2345',
    aircraft_type: 'B763',
    messages: 950,
    seen: 1.5,
  },
  {
    hex: 'A55555',
    flight: 'EJA555',
    lat: 39.02,
    lon: -77.38,
    altitude: 43000,
    speed: 490,
    track: 270,
    vert_rate: 0,
    squawk: '3456',
    aircraft_type: 'C750',
    messages: 600,
    seen: 0.6,
  },
]

// Get altitude color (standard aviation coloring)
function getAltitudeColor(altitude) {
  if (altitude < 1000) return '#ff4444'      // Ground level - red
  if (altitude < 5000) return '#ff8c00'      // Low - orange
  if (altitude < 10000) return '#ffff00'     // Medium low - yellow
  if (altitude < 20000) return '#00ff00'     // Medium - green
  if (altitude < 30000) return '#00ffff'     // Medium high - cyan
  if (altitude < 40000) return '#0088ff'     // High - blue
  return '#ff00ff'                            // Very high - magenta
}

// Create aircraft icon
function createAircraftIcon(track, altitude, selected = false) {
  const color = getAltitudeColor(altitude)
  const size = selected ? 32 : 24
  
  return L.divIcon({
    className: 'aircraft-icon',
    html: `
      <div style="
        transform: rotate(${track}deg);
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        filter: drop-shadow(0 0 4px ${color});
      ">
        <svg viewBox="0 0 24 24" fill="${color}" width="${size}" height="${size}">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
  })
}

// Range rings component
function RangeRings() {
  return (
    <>
      {RANGE_RINGS.map(nm => (
        <Circle
          key={nm}
          center={HOME_POSITION}
          radius={nm * 1852} // Convert nautical miles to meters
          pathOptions={{
            color: 'rgba(0, 255, 136, 0.3)',
            weight: 1,
            fillColor: 'transparent',
            dashArray: '5, 10',
          }}
        />
      ))}
    </>
  )
}

// Stats card component
function StatCard({ icon: Icon, label, value, subvalue, color = 'text-accent-glow' }) {
  return (
    <div className="glass p-4 rounded-xl">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
          {subvalue && <p className="text-xs text-gray-600">{subvalue}</p>}
        </div>
      </div>
    </div>
  )
}

// Aircraft list item
function AircraftListItem({ aircraft, selected, onClick }) {
  const VertIcon = aircraft.vert_rate > 100 ? ArrowUp : 
                   aircraft.vert_rate < -100 ? ArrowDown : Minus
  const vertColor = aircraft.vert_rate > 100 ? 'text-green-400' : 
                    aircraft.vert_rate < -100 ? 'text-red-400' : 'text-gray-500'
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-all ${
        selected ? 'bg-accent-primary/20 border border-accent-primary/50' : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: getAltitudeColor(aircraft.altitude) }}
          />
          <div>
            <p className="font-mono font-bold text-sm">
              {aircraft.flight?.trim() || aircraft.hex}
            </p>
            <p className="text-xs text-gray-500">{aircraft.aircraft_type || 'Unknown'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{aircraft.altitude ? Math.round(aircraft.altitude).toLocaleString() : '---'} ft</p>
          <div className="flex items-center justify-end space-x-1">
            <VertIcon size={12} className={vertColor} />
            <span className="text-xs text-gray-500">{aircraft.speed || '---'} kts</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Map updater component
function MapUpdater({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, map.getZoom(), { duration: 0.5 })
    }
  }, [center, map])
  return null
}

export default function Radar() {
  const [aircraft, setAircraft] = useState([])
  const [selectedAircraft, setSelectedAircraft] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [mapCenter, setMapCenter] = useState(null)
  const mapRef = useRef(null)

  // Load sample data and simulate updates
  useEffect(() => {
    const updateAircraft = () => {
      const sample = generateSampleAircraft()
      // Add some random movement
      const updated = sample.map(ac => ({
        ...ac,
        lat: ac.lat + (Math.random() - 0.5) * 0.01,
        lon: ac.lon + (Math.random() - 0.5) * 0.01,
        altitude: ac.altitude + (Math.random() - 0.5) * 100,
        seen: Math.random() * 2,
      }))
      setAircraft(updated)
      setLastUpdate(new Date())
    }

    updateAircraft()
    const interval = setInterval(updateAircraft, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleAircraftClick = (ac) => {
    setSelectedAircraft(ac.hex === selectedAircraft?.hex ? null : ac)
    if (ac.hex !== selectedAircraft?.hex) {
      setMapCenter([ac.lat, ac.lon])
    }
  }

  const aircraftWithDistance = aircraft
    .filter(a => a.lat && a.lon)
    .map(a => ({
      ...a,
      distance: calculateDistanceNM(HOME_POSITION[0], HOME_POSITION[1], a.lat, a.lon)
    }))
  
  const stats = {
    total: aircraft.length,
    withPosition: aircraftWithDistance.length,
    maxRange: aircraftWithDistance.length > 0 ? Math.max(...aircraftWithDistance.map(a => a.distance)) : 0,
    avgRange: aircraftWithDistance.length > 0 ? aircraftWithDistance.reduce((sum, a) => sum + a.distance, 0) / aircraftWithDistance.length : 0,
  }

  return (
    <main className="min-h-screen pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                <span className="gradient-text">ADS-B Radar</span>
              </h1>
              <p className="text-gray-400 mt-1">
                Live aircraft tracking from my roof antenna
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Live</span>
              </div>
              <div className="text-sm text-gray-600">
                Updated {lastUpdate.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        >
          <StatCard icon={Plane} label="Aircraft Tracked" value={stats.total} />
          <StatCard icon={Radio} label="With Position" value={stats.withPosition} />
          <StatCard icon={TrendingUp} label="Max Range" value={`${Math.round(stats.maxRange)} nm`} />
          <StatCard icon={Activity} label="Avg Range" value={`${Math.round(stats.avgRange)} nm`} />
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="glass-card p-2 rounded-2xl overflow-hidden">
              <div className="relative h-[500px] md:h-[600px] rounded-xl overflow-hidden">
                <MapContainer
                  center={HOME_POSITION}
                  zoom={8}
                  style={{ height: '100%', width: '100%' }}
                  ref={mapRef}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <MapUpdater center={mapCenter} />
                  <RangeRings />
                  
                  {/* Home marker */}
                  <Marker 
                    position={HOME_POSITION}
                    icon={L.divIcon({
                      className: 'home-icon',
                      html: `<div style="
                        width: 16px;
                        height: 16px;
                        background: #00ff88;
                        border-radius: 50%;
                        border: 3px solid #003322;
                        box-shadow: 0 0 20px #00ff88;
                      "></div>`,
                      iconSize: [16, 16],
                      iconAnchor: [8, 8],
                    })}
                  >
                    <Popup>
                      <div className="text-center">
                        <strong>📡 Antenna Location</strong><br/>
                        Loudoun Valley, VA
                      </div>
                    </Popup>
                  </Marker>

                  {/* Aircraft markers */}
                  {aircraft.filter(ac => ac.lat && ac.lon).map(ac => (
                    <Marker
                      key={ac.hex}
                      position={[ac.lat, ac.lon]}
                      icon={createAircraftIcon(ac.track || 0, ac.altitude || 0, selectedAircraft?.hex === ac.hex)}
                      eventHandlers={{
                        click: () => handleAircraftClick(ac),
                      }}
                    >
                      <Popup>
                        <div className="min-w-[200px]">
                          <div className="font-bold text-lg mb-2">
                            {ac.flight?.trim() || ac.hex}
                          </div>
                          <table className="text-sm w-full">
                            <tbody>
                              <tr><td className="text-gray-500">Type</td><td className="text-right">{ac.aircraft_type || 'Unknown'}</td></tr>
                              <tr><td className="text-gray-500">Altitude</td><td className="text-right">{ac.altitude ? Math.round(ac.altitude).toLocaleString() : '---'} ft</td></tr>
                              <tr><td className="text-gray-500">Speed</td><td className="text-right">{ac.speed} kts</td></tr>
                              <tr><td className="text-gray-500">Heading</td><td className="text-right">{ac.track}°</td></tr>
                              <tr><td className="text-gray-500">Squawk</td><td className="text-right">{ac.squawk}</td></tr>
                              <tr><td className="text-gray-500">Messages</td><td className="text-right">{ac.messages}</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>

                {/* Altitude Legend */}
                <div className="absolute bottom-4 left-4 glass p-3 rounded-lg text-xs z-[1000]">
                  <p className="font-medium mb-2">Altitude</p>
                  <div className="space-y-1">
                    {[
                      { color: '#ff4444', label: '< 1k ft' },
                      { color: '#ff8c00', label: '1-5k ft' },
                      { color: '#ffff00', label: '5-10k ft' },
                      { color: '#00ff00', label: '10-20k ft' },
                      { color: '#00ffff', label: '20-30k ft' },
                      { color: '#0088ff', label: '30-40k ft' },
                      { color: '#ff00ff', label: '> 40k ft' },
                    ].map(({ color, label }) => (
                      <div key={label} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-gray-400">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Aircraft List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-4 rounded-2xl h-[500px] md:h-[600px] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Aircraft List</h2>
                <span className="text-xs text-gray-500">{aircraft.length} tracked</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {aircraft
                  .sort((a, b) => (b.altitude || 0) - (a.altitude || 0))
                  .map(ac => (
                    <AircraftListItem
                      key={ac.hex}
                      aircraft={ac}
                      selected={selectedAircraft?.hex === ac.hex}
                      onClick={() => handleAircraftClick(ac)}
                    />
                  ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <div className="glass p-4 rounded-xl flex items-start space-x-3">
            <Info size={20} className="text-accent-glow flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-400">
              <p>
                <strong className="text-white">About this feed:</strong> Aircraft positions are received via ADS-B 
                (1090 MHz) and UAT (978 MHz) antennas mounted on my roof. The receiver runs 24/7 and feeds 
                data to FlightAware, ADS-B Exchange, and other tracking networks.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Sample data shown — live feed coming soon!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
