import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { useComplaintStore } from '../../store/complaintStore'
import { CATEGORY_META, STATUS_META } from '../../utils/mockData'
import { Button, Card, Badge, Avatar, ProgressBar } from '../../components/ui'
import { 
  ChevronLeft, Clock, MapPin, User, MessageSquare, 
  Share2, AlertCircle, CheckCircle2, TrendingUp, 
  Calendar, Shield, MoreHorizontal, Send, Phone
} from 'lucide-react'
import { clsx } from 'clsx'
import { format, formatDistanceToNow } from 'date-fns'

export default function ComplaintTracking() {
  const { id } = useParams()
  const { complaints, addComment, upvoteComplaint } = useComplaintStore()
  const [commentText, setCommentText] = useState('')
  const [activeTab, setActiveTab] = useState<'timeline' | 'details' | 'chat'>('timeline')

  // Find complaint by referenceId or id
  const complaint = complaints.find(c => c.referenceId === id || c.id === id)

  if (!complaint) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-dark-950">
        <div className="text-6xl mb-6">🔍</div>
        <h2 className="text-2xl font-black text-white mb-2">Complaint Not Found</h2>
        <p className="text-slate-500 mb-8">We couldn't find a report with reference ID <span className="text-white font-mono">{id}</span></p>
        <Link to="/dashboard/citizen"><Button>Back to Dashboard</Button></Link>
      </div>
    )
  }

  const meta = CATEGORY_META[complaint.category]
  const statusMeta = STATUS_META[complaint.status]

  const handleAddComment = () => {
    if (!commentText.trim()) return
    addComment(complaint.id, commentText, 'Arjun Mehra')
    setCommentText('')
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-24 pb-20 px-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Back Link */}
        <Link 
          to="/dashboard/citizen" 
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-white mb-8 transition-colors uppercase tracking-widest font-bold"
        >
          <ChevronLeft size={14} /> Back to Dashboard
        </Link>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Panel: 8 Cols */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Card */}
            <Card className="p-8 border-white/10 bg-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Badge className={clsx('px-6 py-2 text-sm font-black rounded-2xl shadow-glow-blue', statusMeta.bg, statusMeta.color)}>
                  {statusMeta.label}
                </Badge>
              </div>
              
              <div className="flex items-start gap-8">
                <div className="w-24 h-24 rounded-3xl bg-dark-950 flex items-center justify-center text-5xl shadow-inner border border-white/5">
                  {meta.icon}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-mono text-primary-500 font-bold mb-2 uppercase tracking-[0.2em]">{complaint.referenceId}</p>
                  <h1 className="text-3xl font-black text-white mb-4 font-display leading-tight">{complaint.title}</h1>
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
              <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
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
                  <button className="p-2 rounded-xl hover:bg-white/5 text-slate-500"><MoreHorizontal size={20} /></button>
                </div>
              </div>
            </Card>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-dark-900 border border-white/5 w-fit">
              {[
                { id: 'timeline', label: 'Live Timeline', icon: <Clock size={16} /> },
                { id: 'details', label: 'Full Details', icon: <AlertCircle size={16} /> },
                { id: 'chat', label: 'Officer Chat', icon: <MessageSquare size={16} /> },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={clsx(
                    'flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300',
                    activeTab === t.id ? 'bg-primary-500 text-white shadow-glow-blue' : 'text-slate-500 hover:text-white'
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
                        <div className="absolute left-[23px] top-10 bottom-0 w-0.5 bg-white/5" />
                      )}
                      
                      {/* Icon Node */}
                      <div className={clsx(
                        'absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-white/5',
                        i === 0 ? 'bg-primary-500 text-white shadow-glow-blue' : 'bg-dark-900 text-slate-600'
                      )}>
                        {event.status === 'submitted' ? '📥' : event.status === 'assigned' ? '👤' : event.status === 'resolved' ? '✅' : '⚙️'}
                      </div>

                      <div className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-primary-500/20 transition-all group">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-white uppercase tracking-widest">{event.status.replace('_', ' ')}</h4>
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
                  <Card className="p-8 border-white/5 bg-white/5">
                    <h3 className="text-lg font-bold text-white mb-6">Description</h3>
                    <p className="text-slate-400 leading-relaxed mb-10">{complaint.description}</p>
                    
                    <h3 className="text-lg font-bold text-white mb-6">Attached Evidence</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {complaint.media.map(m => (
                        <div key={m.id} className="aspect-square rounded-3xl overflow-hidden border border-white/5 group cursor-pointer">
                          <img src={m.url} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'chat' && (
                <motion.div 
                  key="chat" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col h-[600px] glass rounded-3xl overflow-hidden border-white/5"
                >
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <div>
                        <p className="text-xs font-bold text-white">Officer Ramesh Kumar</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Assigned Responder</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-xl"><Phone size={14} /></Button>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <div className="flex justify-center">
                      <Badge className="bg-dark-900 border border-white/5 text-slate-600">Chat started on {format(new Date(complaint.createdAt), 'MMM d')}</Badge>
                    </div>
                    
                    {complaint.comments.map(c => (
                      <div key={c.id} className={clsx('flex flex-col', c.authorRole === 'citizen' ? 'items-end' : 'items-start')}>
                        <div className={clsx(
                          'max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed',
                          c.authorRole === 'citizen' ? 'bg-primary-500 text-white rounded-tr-none' : 'bg-white/10 text-slate-300 rounded-tl-none'
                        )}>
                          {c.text}
                        </div>
                        <span className="text-[10px] text-slate-600 font-bold mt-2 uppercase tracking-tighter">
                          {c.authorName} · {formatDistanceToNow(new Date(c.timestamp))} ago
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="p-4 bg-dark-950 border-t border-white/5 flex gap-3">
                    <input 
                      placeholder="Type a message to the officer..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary-500/50 outline-none transition-all"
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                    />
                    <Button size="sm" className="px-5" onClick={handleAddComment}>
                      <Send size={16} />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar: 4 Cols */}
          <div className="lg:col-span-4 space-y-6">
            {/* Resolution Progress */}
            <Card className="p-8 border-white/10 bg-white/5 text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-primary-500/10 flex items-center justify-center text-4xl mx-auto mb-6 shadow-glow-blue border border-primary-500/10">
                ⏱️
              </div>
              <h3 className="text-xl font-black text-white mb-2">Resolving Soon</h3>
              <p className="text-sm text-slate-500 mb-8">Estimated resolution by Friday, 6:00 PM</p>
              <div className="space-y-4">
                <ProgressBar value={40} showLabel />
                <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                  <span className={clsx(complaint.status === 'submitted' && 'text-primary-500')}>Received</span>
                  <span className={clsx(complaint.status === 'assigned' && 'text-primary-500')}>Confirming</span>
                  <span className={clsx(complaint.status === 'in_progress' && 'text-primary-500')}>Assigning</span>
                  <span className={clsx(complaint.status === 'in_progress' && 'text-primary-500')}>On Field</span>
                  <span className={clsx(complaint.status === 'resolved' && 'text-primary-500')}>Resolved</span>
                </div>
              </div>
            </Card>

            {/* Officer Info */}
            <Card className="p-6 border-white/5 bg-white/5">
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                <User size={16} className="text-primary-400" /> Assigned Officer
              </h3>
              <div className="flex items-center gap-4 mb-6">
                <Avatar name="Ramesh Kumar" size="lg" className="w-14 h-14 bg-brand-violet shadow-glow-violet" />
                <div>
                  <p className="font-bold text-white">Inspector Ramesh Kumar</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Badge: CE-9821</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-lg font-bold text-white">4.8</p>
                  <p className="text-[10px] text-slate-600 uppercase tracking-tighter">Rating</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                  <p className="text-lg font-bold text-white">18h</p>
                  <p className="text-[10px] text-slate-600 uppercase tracking-tighter">Avg Res.</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-6">View Officer Profile</Button>
            </Card>

            {/* Location Context */}
            <Card className="p-6 border-white/5 bg-white/5">
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={16} className="text-emerald-400" /> Area Context
              </h3>
              <div className="h-40 rounded-2xl bg-dark-900 border border-white/5 mb-4 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-grid opacity-10" />
                <MapPin size={24} className="text-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Ward</span>
                  <span className="text-white font-bold">{complaint.ward}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Nearby Complaints</span>
                  <span className="text-white font-bold">12 Active</span>
                </div>
              </div>
            </Card>

            {/* Need Help? */}
            <div className="p-6 rounded-3xl bg-brand-rose/5 border border-brand-rose/10 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose mb-4">
                <Shield size={20} />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Need Immediate Help?</h4>
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
