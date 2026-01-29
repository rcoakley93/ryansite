import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Plane, 
  MapPin, 
  Activity,
  ArrowLeft,
  RefreshCw,
  Satellite,
  Antenna,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  Radio,
  TrendingUp
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import ParticleBackground from '../components/custom/ParticleBackground';
import MouseSpotlight from '../components/custom/MouseSpotlight';

// Ryan's location (Loudoun Valley Estates, VA)
const HOME_POSITION: [number, number] = [39.0458, -77.4875];
const RANGE_RINGS = [50, 100, 150, 200, 250];

function calculateDistanceNM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3440.065;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

const AIRCRAFT_DATA = [
  { hex: 'A12345', flight: 'AA1234', airline: 'American Airlines', type: 'B738', altitude: 32000, speed: 485, track: 245, lat: 39.15, lon: -77.35, vert_rate: 0, messages: 1250 },
  { hex: 'A67890', flight: 'UA567', airline: 'United Airlines', type: 'A320', altitude: 28000, speed: 450, track: 120, lat: 38.85, lon: -77.65, vert_rate: -1200, messages: 890 },
  { hex: 'ABCDEF', flight: 'DL890', airline: 'Delta Air Lines', type: 'B739', altitude: 35000, speed: 510, track: 15, lat: 39.25, lon: -77.15, vert_rate: 0, messages: 2100 },
  { hex: 'A11111', flight: 'SWA432', airline: 'Southwest', type: 'B737', altitude: 18000, speed: 340, track: 310, lat: 38.95, lon: -77.85, vert_rate: 2500, messages: 450 },
  { hex: 'A22222', flight: 'N12345', airline: 'Private', type: 'C172', altitude: 4500, speed: 120, track: 90, lat: 39.08, lon: -77.52, vert_rate: 500, messages: 120 },
  { hex: 'A33333', flight: 'B6789', airline: 'JetBlue', type: 'A321', altitude: 32000, speed: 460, track: 25, lat: 38.75, lon: -77.25, vert_rate: 0, messages: 1800 },
];

function getAltitudeColor(altitude: number) {
  if (altitude < 1000) return '#ff4444';
  if (altitude < 5000) return '#ff8c00';
  if (altitude < 10000) return '#ffff00';
  if (altitude < 20000) return '#00ff00';
  if (altitude < 30000) return '#00ffff';
  if (altitude < 40000) return '#0088ff';
  return '#ff00ff';
}

// Convert the divIcon from the original logic to this file
function createAircraftIcon(track: number, altitude: number, selected: boolean = false) {
  const color = getAltitudeColor(altitude);
  const size = selected ? 32 : 24;
  
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
  });
}

function MapUpdater({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, Math.max(map.getZoom(), 10), { duration: 0.5 });
    }
  }, [center, map]);
  return null;
}

const StatCard = ({ icon: Icon, label, value, subvalue, delay = 0 }: { icon: any, label: string, value: string | number, subvalue?: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass rounded-xl p-5 border border-white/5 hover:border-cyan/30 transition-all duration-300 group"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-lg bg-cyan/10 group-hover:bg-cyan/20 transition-colors">
        <Icon className="w-4 h-4 text-cyan" />
      </div>
      <span className="text-white/40 text-xs font-mono uppercase">{label}</span>
    </div>
    <div className="text-3xl font-bold text-white group-hover:text-cyan transition-colors">
      {value}
    </div>
    {subvalue && (
      <p className="text-white/30 text-xs mt-1">{subvalue}</p>
    )}
  </motion.div>
);

const AircraftListItem = ({ aircraft, selected, onClick }: any) => {
  const VertIcon = aircraft.vert_rate > 100 ? ArrowUp : 
                   aircraft.vert_rate < -100 ? ArrowDown : Minus;
  const vertColor = aircraft.vert_rate > 100 ? 'text-green-400' : 
                    aircraft.vert_rate < -100 ? 'text-red-400' : 'text-white/30';
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-3 rounded-xl cursor-pointer transition-all border ${
        selected ? 'bg-cyan/10 border-cyan/30' : 'bg-white/5 border-white/5 hover:bg-white/10'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: getAltitudeColor(aircraft.altitude) }}
          />
          <div>
            <p className="font-mono font-bold text-sm text-white">
              {aircraft.flight?.trim() || aircraft.hex}
            </p>
            <p className="text-xs text-white/40">{aircraft.aircraft_type || 'Unknown'}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-white">{aircraft.altitude ? Math.round(aircraft.altitude).toLocaleString() : '---'} ft</p>
          <div className="flex items-center justify-end space-x-1">
            <VertIcon size={12} className={vertColor} />
            <span className="text-xs text-white/40">{aircraft.speed || '---'} kts</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Radar() {
  const [aircraft, setAircraft] = useState(AIRCRAFT_DATA);
  const [selectedAircraft, setSelectedAircraft] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const mapRef = useRef(null);

  // Home marker icon definition (Leaflet)
  const homeIcon = L.divIcon({
    className: 'home-icon',
    html: `<div style="
      width: 16px;
      height: 16px;
      background: #00ffff;
      border-radius: 50%;
      border: 3px solid #003333;
      box-shadow: 0 0 20px #00ffff;
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  const handleAircraftClick = (ac: any) => {
    setSelectedAircraft(ac.hex === selectedAircraft ? null : ac.hex);
    if (ac.hex !== selectedAircraft) {
      setMapCenter([ac.lat, ac.lon]);
    }
  };

  const aircraftWithDistance = aircraft
    .filter(a => a.lat && a.lon)
    .map(a => ({
      ...a,
      distance: calculateDistanceNM(HOME_POSITION[0], HOME_POSITION[1], a.lat, a.lon)
    }));
  
  const stats = {
    total: aircraft.length,
    visible: aircraftWithDistance.length,
    maxRange: aircraftWithDistance.length > 0 ? Math.max(...aircraftWithDistance.map(a => a.distance)) : 0,
    avgRange: aircraftWithDistance.length > 0 ? aircraftWithDistance.reduce((sum, a) => sum + a.distance, 0) / aircraftWithDistance.length : 0,
  };

  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden">
      <ParticleBackground />
      <MouseSpotlight />
      <div className="noise-overlay" />

      <header className="fixed top-0 left-0 right-0 z-[1001] px-6 py-4">
        <div className="glass rounded-full px-6 py-3 flex items-center justify-between max-w-6xl mx-auto">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center">
              <span className="text-cyan font-bold text-sm">RC</span>
            </div>
            <span className="text-white/70 group-hover:text-white transition-colors font-medium">Ryan Coakley</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-white/40 text-sm hidden md:block">ADS-B Radar</span>
            <a href="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </a>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
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
                <p className="text-gray-400 mt-1">Live aircraft tracking from my roof antenna</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Live</span>
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <RefreshCw className="w-3 h-3" /> Updated {lastUpdated.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={Plane} label="Total Tracked" value={stats.total} delay={0.1} />
            <StatCard icon={Radio} label="With Position" value={stats.visible} delay={0.2} />
            <StatCard icon={TrendingUp} label="Max Range" value={`${Math.round(stats.maxRange)} nm`} delay={0.3} />
            <StatCard icon={Activity} label="Avg Range" value={`${Math.round(stats.avgRange)} nm`} delay={0.4} />
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="glass p-2 rounded-2xl overflow-hidden border border-white/10">
                <div className="relative h-[600px] rounded-xl overflow-hidden bg-[#0a0a0a]">
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
                    {RANGE_RINGS.map(nm => (
                      <Circle
                        key={nm}
                        center={HOME_POSITION}
                        radius={nm * 1852}
                        pathOptions={{
                          color: 'rgba(0, 255, 255, 0.2)',
                          weight: 1,
                          fillColor: 'transparent',
                          dashArray: '5, 10',
                        }}
                      />
                    ))}
                    
                    <Marker position={HOME_POSITION} icon={homeIcon}>
                      <Popup>
                        <div className="text-center text-black">
                          <strong>📡 Antenna Location</strong><br/>
                          Loudoun Valley, VA
                        </div>
                      </Popup>
                    </Marker>

                    {aircraft.filter((ac: any) => ac.lat && ac.lon).map((ac: any) => (
                      <Marker
                        key={ac.hex}
                        position={[ac.lat, ac.lon]}
                        icon={createAircraftIcon(ac.track || 0, ac.altitude || 0, selectedAircraft === ac.hex)}
                        eventHandlers={{
                          click: () => handleAircraftClick(ac),
                        }}
                      >
                        <Popup>
                          <div className="min-w-[180px] p-1 font-mono text-black">
                            <div className="font-bold text-lg border-b border-black/10 mb-2 pb-1">
                              {ac.flight?.trim() || ac.hex}
                            </div>
                            <div className="grid grid-cols-2 gap-y-1 text-xs">
                              <span className="text-black/60">ALT:</span><span className="text-right">{ac.altitude?.toLocaleString()} ft</span>
                              <span className="text-black/60">SPD:</span><span className="text-right">{ac.speed} kts</span>
                              <span className="text-black/60">HDG:</span><span className="text-right">{ac.track}°</span>
                              <span className="text-black/60">TYPE:</span><span className="text-right">{ac.type}</span>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>

                  <div className="absolute bottom-6 left-6 glass p-4 rounded-2xl z-[1000] border border-white/10 min-w-[140px]">
                    <p className="text-[10px] uppercase tracking-wider text-cyan font-bold mb-3">Altitude (FT)</p>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { color: '#ff4444', label: '< 1k' },
                        { color: '#ff8c00', label: '1-5k' },
                        { color: '#ffff00', label: '5-10k' },
                        { color: '#00ff00', label: '10-20k' },
                        { color: '#00ffff', label: '20-30k' },
                        { color: '#0088ff', label: '30-40k' },
                      ].map(l => (
                        <div key={l.label} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                          <span className="text-[10px] text-white/50">{l.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="glass p-4 rounded-2xl h-[600px] overflow-hidden flex flex-col border border-white/10">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                  <h2 className="font-semibold text-white">Traffic</h2>
                  <span className="text-xs font-mono text-cyan">{aircraft.length} active</span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {aircraft
                    .sort((a: any, b: any) => (b.altitude || 0) - (a.altitude || 0))
                    .map((ac: any) => (
                      <AircraftListItem
                        key={ac.hex}
                        aircraft={ac}
                        selected={selectedAircraft === ac.hex}
                        onClick={() => handleAircraftClick(ac)}
                      />
                    ))}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <div className="glass p-4 rounded-xl flex items-start space-x-3 border border-white/10">
              <Info size={20} className="text-cyan flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-400">
                <p>
                  <strong className="text-white">Note:</strong> Displaying simulated data for preview. Live feed connects to local dump1090-fa instance over Tailscale.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
