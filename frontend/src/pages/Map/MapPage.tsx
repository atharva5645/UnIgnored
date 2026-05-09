import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { COMPLAINTS, CATEGORY_META, STATUS_META } from '../../utils/mockData'
import { Card, Badge, Button, Avatar } from '../../components/ui'
import { 
  Filter, Search, Navigation, Layers, Info, 
  ChevronRight, Maximize2, MapPin, AlertCircle, ExternalLink
} from 'lucide-react'
import { clsx } from 'clsx'
import { Link, useSearchParams } from 'react-router-dom'
import { useComplaints } from '../../hooks/useComplaints'

// Fix Leaflet icon issue
const DefaultIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="relative w-8 h-8 flex items-center justify-center">
    <div class="absolute w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-xl"></div>
    <div class="absolute bottom-0 w-1 h-2 bg-blue-500"></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

L.Marker.prototype.options.icon = DefaultIcon

function MapController({ center }: { center: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

export default function MapPage() {
  const [searchParams] = useSearchParams()
  const { complaints } = useComplaints()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090])
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const id = searchParams.get('id')

    if (lat && lng) {
      setMapCenter([parseFloat(lat), parseFloat(lng)])
    }

    if (id) {
      const complaint = complaints.find(c => c.id === id || c.referenceId === id)
      if (complaint) {
        setSelectedComplaint(complaint)
        setMapCenter([complaint.location.lat, complaint.location.lng])
      }
    }
  }, [searchParams, complaints])

  const filteredComplaints = complaints.filter(c => 
    selectedCategory === 'all' || c.category === selectedCategory
  )

  return (
    <div className="h-screen w-full relative bg-slate-50 dark:bg-dark-950 pt-16 overflow-hidden transition-colors duration-500">
      {/* Map Implementation */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={mapCenter} 
          zoom={13} 
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredComplaints.map(c => (
            <Marker 
              key={c.id} 
              position={[c.location.lat, c.location.lng]}
              eventHandlers={{
                click: () => {
                  setSelectedComplaint(c)
                  setMapCenter([c.location.lat, c.location.lng])
                },
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[150px]">
                  <p className="text-xs font-bold mb-1 text-slate-900 dark:text-white">{c.title}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="info" className="text-[8px]">{c.status}</Badge>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://www.google.com/maps/search/?api=1&query=${c.location.lat},${c.location.lng}`, '_blank');
                      }}
                      className="text-[10px] text-primary-500 font-bold hover:underline flex items-center gap-1"
                    >
                      <ExternalLink size={10} /> Google Maps
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          <MapController center={mapCenter} />
        </MapContainer>
      </div>

      {/* Floating Controls */}
      <div className="absolute top-20 left-6 z-10 flex flex-col gap-3">
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-3 glass rounded-none border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-2xl"
        >
          <Layers size={20} />
        </button>
        <button className="p-3 glass rounded-none border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-2xl">
          <Navigation size={20} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            className="absolute top-20 bottom-6 left-6 w-96 z-10 flex flex-col gap-4 pointer-events-none"
          >
            {/* Search & Filter */}
            <Card className="p-4 pointer-events-auto">
              <div className="relative mb-4">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  placeholder="Search location or ID..." 
                  className="w-full bg-slate-100 dark:bg-dark-950 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:border-primary-500/50 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className={clsx(
                    'px-4 py-1.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap transition-all',
                    selectedCategory === 'all' ? 'bg-primary-500 text-white shadow-glow-blue' : 'bg-slate-200 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  All
                </button>
                {Object.entries(CATEGORY_META).map(([key, meta]) => (
                  <button 
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={clsx(
                      'px-4 py-1.5 rounded-full text-[10px] font-bold uppercase whitespace-nowrap transition-all',
                      selectedCategory === key ? 'bg-primary-500 text-white shadow-glow-blue' : 'bg-slate-200 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    )}
                  >
                    {meta.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* List of nearby items */}
            <div className="flex-1 overflow-y-auto space-y-3 pointer-events-auto custom-scrollbar">
              {filteredComplaints.map(c => (
                <Card 
                  key={c.id} 
                  hover 
                  onClick={() => {
                    setSelectedComplaint(c)
                    setMapCenter([c.location.lat, c.location.lng])
                  }}
                  className={clsx(
                    'p-4 cursor-pointer transition-all',
                    selectedComplaint?.id === c.id ? 'bg-primary-500/10 border-primary-500/50' : ''
                  )}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{CATEGORY_META[c.category as keyof typeof CATEGORY_META].icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">{c.referenceId}</span>
                        <Badge variant="info" className="text-[8px] px-1 py-0">{c.status}</Badge>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{c.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 truncate">{c.location.address}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Item Detail Popover */}
      <AnimatePresence>
        {selectedComplaint && (
          <motion.div 
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl z-20 px-4"
          >
            <Card className="p-6 border-primary-500/20 shadow-2xl relative overflow-hidden">
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                <Maximize2 size={16} />
              </button>

              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-4xl shadow-inner border border-slate-200 dark:border-white/5">
                  {CATEGORY_META[selectedComplaint.category as keyof typeof CATEGORY_META].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="info">{STATUS_META[selectedComplaint.status as keyof typeof STATUS_META].label}</Badge>
                    <span className="text-xs text-slate-500 font-mono">{selectedComplaint.referenceId}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{selectedComplaint.title}</h3>
                  <p className="text-xs text-slate-400 mb-4">{selectedComplaint.location.address}</p>
                  
                  <div className="flex items-center gap-4">
                    <Link to={`/complaints/track/${selectedComplaint.referenceId}`}>
                      <Button size="sm" glow>Track Full Process</Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedComplaint.location.lat},${selectedComplaint.location.lng}`, '_blank')}
                      className="text-primary-500 hover:text-primary-600 flex items-center gap-2"
                    >
                      <MapPin size={14} /> Google Maps
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-500">👍 {selectedComplaint.upvotes}</Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Legend */}
      <div className="absolute bottom-6 right-6 z-10 glass p-4 rounded-2xl border border-white/10 hidden md:block">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Live Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="w-3 h-3 bg-primary-500 rounded-full" /> <span>Active Reports</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="w-3 h-3 bg-emerald-500 rounded-full" /> <span>Resolved Cases</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="w-3 h-3 bg-brand-rose rounded-full animate-pulse" /> <span>Critical Issues</span>
          </div>
        </div>
      </div>
    </div>
  )
}
