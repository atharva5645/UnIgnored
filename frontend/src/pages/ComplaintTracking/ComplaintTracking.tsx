import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useComplaintStore } from '../../store/complaintStore'
import { CATEGORY_META, STATUS_META } from '../../utils/mockData'
import { Button, Card, Badge, Avatar, ProgressBar } from '../../components/ui'
import { 
  ChevronLeft, Clock, MapPin, User, MessageSquare, 
  Share2, AlertCircle, CheckCircle2, TrendingUp, 
  Calendar, Shield, MoreHorizontal, Send, Phone, Maximize2
} from 'lucide-react'
import { clsx } from 'clsx'
import { format, formatDistanceToNow } from 'date-fns'

import { useComplaints } from '../../hooks/useComplaints'
import { useAuthStore } from '../../store/authStore'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Leaflet with Vite
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

export default function ComplaintTracking() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { complaints, isLoading, upvoteComplaint, addComment } = useComplaints()
  const [commentText, setCommentText] = useState('')
  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'chat'>('timeline')

  // Find complaint by referenceId or id
  const complaint = complaints.find(c => c.referenceId === id || c.id === id)

  if (isLoading && !complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-950 transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Live Data...</p>
        </div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-dark-950 transition-colors duration-500">
        <div className="text-6xl mb-6">🔍</div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Complaint Not Found</h2>
        <p className="text-slate-500 mb-8">We couldn't find a report with reference ID <span className="text-slate-900 dark:text-white font-mono">{id}</span></p>
        <Link to="/dashboard/citizen"><Button>Back to Dashboard</Button></Link>
      </div>
    )
  }

  const meta = CATEGORY_META[complaint.category]
  const statusMeta = STATUS_META[complaint.status]

  const handleAddComment = () => {
    if (!commentText.trim() || !user) return
    // In a real app, this would call a service to add a comment to Firestore
    // For now, let's keep it simple as the requirement focus is on complaints
    setCommentText('')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 pt-24 pb-20 px-6 transition-colors duration-500">
      <div className="max-w-[1600px] mx-auto">
        {/* Back Link */}
        <Link 
          to="/dashboard/citizen" 
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors uppercase tracking-widest font-bold"
        >
          <ChevronLeft size={14} /> Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Panel: 8 Cols */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Card */}
            <Card className="p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Badge className={clsx('px-6 py-2 text-sm font-black rounded-2xl shadow-glow-blue', statusMeta.bg, statusMeta.color)}>
                  {statusMeta.label}
                </Badge>
              </div>
              
              <div className="flex items-start gap-8">
                <div className="w-24 h-24 rounded-3xl bg-slate-100 dark:bg-dark-950 flex items-center justify-center text-5xl shadow-inner border border-slate-200 dark:border-white/5">
                  {meta.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-mono text-primary-500 font-bold mb-2 uppercase tracking-[0.2em]">{complaint.referenceId}</p>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 font-display leading-tight">{complaint.title}</h1>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <MapPin size={14} className="text-primary-500" /> {complaint.location.address}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Calendar size={14} className="text-primary-500" /> {format(new Date(complaint.createdAt), 'MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <TrendingUp size={14} className="text-primary-500" /> Severity Level {complaint.severity}/10
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-10 pt-8 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="secondary" size="sm" onClick={() => upvoteComplaint(complaint.id)} className="px-6">
                    👍 {complaint.upvotes} Upvotes
                  </Button>
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <Share2 size={16} className="mr-2" /> Share Link
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info" className="hidden sm:block">EST. Resolution: {complaint.estimatedResolutionDays} Days</Badge>
                  <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500"><MoreHorizontal size={20} /></button>
                </div>
              </div>
            </Card>

             {/* Navigation Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200 dark:bg-dark-900 border border-slate-300 dark:border-white/5 w-fit">
              {[
                { id: 'timeline', label: 'Live Timeline', icon: <Clock size={16} /> },
                { id: 'details', label: 'Full Details', icon: <AlertCircle size={16} /> },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={clsx(
                    'flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300',
                    activeTab === t.id ? 'bg-primary-500 text-white shadow-glow-blue' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'timeline' && (
                <motion.div 
                  key="timeline" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {complaint.timeline.map((event, i) => (
                    <div key={event.id} className="relative pl-12 pb-2">
                      {/* Line */}
                      {i < complaint.timeline.length - 1 && (
                        <div className="absolute left-[23px] top-10 bottom-0 w-0.5 bg-slate-200 dark:bg-white/5" />
                      )}
                      
                      {/* Icon Node */}
                      <div className={clsx(
                        'absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-slate-200 dark:border-white/5',
                        i === 0 ? 'bg-primary-500 text-white shadow-glow-blue' : 'bg-slate-100 dark:bg-dark-900 text-slate-600'
                      )}>
                        {event.status === 'submitted' ? '📥' : event.status === 'assigned' ? '👤' : event.status === 'resolved' ? '✅' : '⚙️'}
                      </div>

                      <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl p-6 hover:border-primary-500/20 transition-all group">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">{event.status.replace('_', ' ')}</h4>
                          <span className="text-[10px] font-bold text-slate-600">{format(new Date(event.timestamp), 'MMM d, h:mm a')}</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">{event.note}</p>
                        <div className="flex items-center gap-2">
                          <Avatar name={event.actor} size="sm" className="w-6 h-6 text-[8px]" />
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{event.actor} · {event.actorRole}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div 
                  key="details" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <Card className="p-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Description</h3>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-10">{complaint.description}</p>
                    
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Attached Evidence</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {complaint.media.map(m => (
                        <div key={m.id} className="aspect-square rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 group cursor-pointer">
                          <img src={m.url} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Sidebar: 4 Cols */}
          <div className="lg:col-span-4 space-y-6">
            {/* Resolution Progress */}
            <Card className="p-8 text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-primary-500/10 flex items-center justify-center text-4xl mx-auto mb-6 shadow-glow-blue border border-primary-500/10">
                ⏱️
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{statusMeta.label}</h3>
              <p className="text-sm text-slate-500 mb-8">
                Estimated resolution by {complaint.slaDeadline ? format(new Date(complaint.slaDeadline), 'EEEE, h:mm a') : 'TBD'}
              </p>
              <div className="space-y-4">
                <ProgressBar 
                  value={
                    complaint.status === 'submitted' ? 20 :
                    complaint.status === 'under_review' ? 40 :
                    complaint.status === 'assigned' ? 60 :
                    complaint.status === 'in_progress' ? 80 :
                    complaint.status === 'resolved' ? 100 : 
                    complaint.status === 'closed' ? 100 : 20
                  } 
                  showLabel 
                />
                <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                  <span className={clsx((complaint.status === 'submitted' || complaint.status === 'under_review') && 'text-primary-500')}>Received</span>
                  <span className={clsx(complaint.status === 'assigned' && 'text-primary-500')}>Assigned</span>
                  <span className={clsx(complaint.status === 'in_progress' && 'text-primary-500')}>On Field</span>
                  <span className={clsx((complaint.status === 'resolved' || complaint.status === 'closed') && 'text-primary-500')}>Resolved</span>
                </div>
              </div>
            </Card>

            {/* Location Context */}
            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={16} className="text-emerald-400" /> Area Context
              </h3>
              <div 
                className="h-48 rounded-2xl bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-white/5 mb-4 relative overflow-hidden cursor-pointer group"
                onClick={() => navigate(`/complaints/map?lat=${complaint.location.lat}&lng=${complaint.location.lng}&id=${complaint.id}`)}
              >
                <MapContainer 
                  center={[complaint.location.lat, complaint.location.lng]} 
                  zoom={15} 
                  className="h-full w-full z-0"
                  zoomControl={false}
                  dragging={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="map-tiles-dark"
                  />
                  <Marker position={[complaint.location.lat, complaint.location.lng]} />
                </MapContainer>
                {/* Overlay with hover effect */}
                <div className="absolute inset-0 z-10 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all flex items-center justify-center">
                  <div className="bg-white/90 dark:bg-dark-950/90 px-4 py-2 rounded-xl shadow-2xl scale-0 group-hover:scale-100 transition-all duration-300">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 flex items-center gap-2">
                      <Maximize2 size={12} /> View Full Map
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Ward</span>
                  <span className="text-slate-900 dark:text-white font-bold">{complaint.location?.ward || complaint.ward || 'Unspecified Ward'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Nearby Complaints</span>
                  <span className="text-slate-900 dark:text-white font-bold">
                    {complaints.filter(c => 
                      c.id !== complaint.id && 
                      (c.location?.ward === complaint.location?.ward || c.ward === complaint.ward) && 
                      ['submitted', 'under_review', 'assigned', 'in_progress'].includes(c.status)
                    ).length} Active
                  </span>
                </div>
              </div>
            </Card>

            {/* Need Help? */}
            <div className="p-6 rounded-3xl bg-brand-rose/5 border border-brand-rose/10 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose mb-4">
                <Shield size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Need Immediate Help?</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
                If this is a life-threatening emergency, please contact 112 directly.
              </p>
              <Button variant="ghost" size="sm" className="text-brand-rose w-full">Report Inaccuracy</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
