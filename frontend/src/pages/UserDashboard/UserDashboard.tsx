import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useComplaintStore } from '../../store/complaintStore'
import { useAuthStore } from '../../store/authStore'
import { useComplaints } from '../../hooks/useComplaints'
import { CATEGORY_META, STATUS_META } from '../../utils/mockData'
import { Button, StatCard, Card, Badge, Avatar, Skeleton } from '../../components/ui'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Plus, Search, Filter, List, Layout, Calendar, Map as MapIcon, 
  ChevronRight, TrendingUp, CheckCircle2, Clock, Award, FileText,
  Download, Bell, Share2, MoreHorizontal
} from 'lucide-react'
import { clsx } from 'clsx'
import { format, subDays, isSameDay } from 'date-fns'

// --- Activity Heatmap Component ---
function ActivityHeatmap() {
  const weeks = 15
  const days = Array.from({ length: weeks * 7 }, (_, i) => {
    const date = subDays(new Date(), (weeks * 7 - 1 - i))
    const count = Math.random() > 0.6 ? Math.floor(Math.random() * 5) : 0
    return { date, count }
  })

  const getColor = (c: number) => {
    if (c === 0) return 'bg-slate-100 dark:bg-white/5'
    if (c === 1) return 'bg-black/20 dark:bg-[#00d1ff]/20'
    if (c === 2) return 'bg-black/40 dark:bg-[#00d1ff]/40'
    if (c === 3) return 'bg-black/60 dark:bg-[#00d1ff]/60'
    return 'bg-black dark:bg-[#00d1ff]'
  }

  return (
    <Card className="p-8 border-2 border-black dark:border-white/5 shadow-premium">
      <h3 className="text-xs font-black text-black dark:text-white mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
        <TrendingUp size={16} className="text-black dark:text-[#00d1ff]" /> Activity Intelligence
      </h3>
      <div className="flex gap-1.5 overflow-x-auto pb-4 custom-scrollbar">
        {Array.from({ length: weeks }, (_, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {days.slice(wi * 7, wi * 7 + 7).map((d, di) => (
              <div 
                key={di} 
                title={`${format(d.date, 'MMM d')}: ${d.count} actions`}
                className={clsx('w-3.5 h-3.5 rounded-[4px] transition-all duration-500 hover:scale-125 hover:z-10 cursor-pointer', getColor(d.count))} 
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Efficiency Grid</p>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Min</span>
          {[0, 1, 2, 3, 4].map(i => <div key={i} className={clsx('w-2.5 h-2.5 rounded-[2px]', getColor(i))} />)}
          <span>Max</span>
        </div>
      </div>
    </Card>
  )
}

// --- Kanban Board Component ---
function KanbanBoard({ complaints }: { complaints: any[] }) {
  const columns = [
    { id: 'todo', label: 'Inbox', icon: <Clock size={16} />, statuses: ['submitted', 'under_review'] },
    { id: 'wip', label: 'Executing', icon: <TrendingUp size={16} />, statuses: ['assigned', 'in_progress', 'escalated'] },
    { id: 'done', label: 'Archived', icon: <CheckCircle2 size={16} />, statuses: ['resolved', 'verified', 'closed'] },
  ]

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 mt-8 custom-scrollbar">
      {columns.map(col => {
        const items = complaints.filter(c => col.statuses.includes(c.status))
        return (
          <div key={col.id} className="min-w-[340px] flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[12px] bg-black dark:bg-[#00d1ff] flex items-center justify-center text-white dark:text-black">
                  {col.icon}
                </div>
                <h4 className="text-sm font-black text-black dark:text-white uppercase tracking-[0.2em]">{col.label}</h4>
              </div>
              <Badge variant="info" className="bg-black text-white dark:bg-[#00d1ff] dark:text-black">{items.length}</Badge>
            </div>
            
            <div className="flex-1 space-y-4 p-4 rounded-[32px] bg-slate-50 dark:bg-white/5 border-2 border-black/5 dark:border-white/5 min-h-[500px]">
              {items.map(c => (
                <Link to={`/complaints/track/${c.referenceId}`} key={c.id}>
                  <Card hover className="p-5 bg-white dark:bg-[#0f172a] border-black dark:border-white/5 hover:border-black dark:hover:border-[#00d1ff] shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-[14px] bg-slate-50 dark:bg-white/5 flex items-center justify-center text-xl shadow-inner">
                        {CATEGORY_META[c.category as keyof typeof CATEGORY_META].icon}
                      </div>
                      <Badge variant={c.severity >= 7 ? 'error' : c.severity >= 4 ? 'warning' : 'info'}>
                        S{c.severity}
                      </Badge>
                    </div>
                    <h5 className="text-base font-black text-black dark:text-white mb-1 line-clamp-1">{c.title}</h5>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">{c.referenceId}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t-2 border-black/5 dark:border-white/5">
                      <div className="flex -space-x-3">
                        <Avatar name={c.citizenName} size="sm" className="ring-4 ring-white dark:ring-[#0f172a]" />
                        {c.assignedOfficer && <Avatar name={c.assignedOfficer} size="sm" className="ring-4 ring-white dark:ring-[#0f172a]" />}
                      </div>
                      <span className="text-xs text-slate-400 font-black uppercase tracking-tighter">{format(new Date(c.createdAt), 'MMM d')}</span>
                    </div>
                  </Card>
                </Link>
              ))}
              {items.length === 0 && (
                <div className="h-40 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600">
                  <div className="text-4xl mb-4 grayscale opacity-20">📭</div>
                  <p className="text-xs font-black uppercase tracking-[0.3em]">Sector Clear</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// --- Main Dashboard Component ---
export default function UserDashboard() {
  const { user } = useAuthStore()
  const { viewMode, setViewMode, filterStatus, searchQuery, setFilter } = useComplaintStore()
  const { complaints, filteredComplaints, isLoading: storeLoading } = useComplaints()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setFilter('searchQuery', '');
    setFilter('filterStatus', 'all');
    
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [setFilter])

  const myComplaints = complaints.slice(0, 15)
  const filtered = filteredComplaints

  const stats = [
    { label: 'Intelligence Filed', value: myComplaints.length, icon: '📋', trend: 12 },
    { label: 'Mission Success', value: myComplaints.filter(c => ['resolved', 'verified'].includes(c.status)).length, icon: '✅', trend: 8 },
    { label: 'Response Latency', value: '2.4d', icon: '⏱️', trend: -5 },
    { label: 'Citizen Rank', value: user?.rewardPoints || 0, icon: '🏆', trend: 25 },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] pb-32">
      <div className="max-w-[1800px] mx-auto px-10 pt-32">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
        >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="info" className="bg-black text-white dark:bg-[#00d1ff] dark:text-black px-4 py-1.5 shadow-glow-white dark:shadow-glow-cyan">Verified Citizen</Badge>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Live Feed Active</span>
            </div>
            <h1 className="text-6xl font-black text-black dark:text-white font-display tracking-tighter leading-none mb-4">
              System Console, <span className="text-slate-400 dark:text-slate-600">{user?.name.split(' ')[0]}</span>
            </h1>
            <p className="text-lg text-slate-500 font-bold tracking-tight">Synchronized overview for <span className="text-black dark:text-white underline decoration-2 underline-offset-4">{format(new Date(), 'MMMM d, yyyy')}</span></p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/complaints/new">
              <Button size="xl" variant="primary" className="shadow-glow-white dark:shadow-glow-cyan group">
                <Plus size={20} className="mr-3 group-hover:rotate-90 transition-transform duration-500" /> FILE NEW INTELLIGENCE
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {loading ? (
                <Skeleton className="h-44 rounded-[32px]" />
              ) : (
                <StatCard {...s} value={s.value.toString()} />
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Panel */}
          <div className="lg:col-span-8 space-y-12">
            {/* View Controls & Filter */}
            <Card className="p-3 flex flex-wrap items-center justify-between gap-4 border-2 border-black dark:border-white/5 bg-slate-50 dark:bg-white/5 rounded-[40px]">
              <div className="flex items-center gap-2 p-1.5 rounded-[32px] bg-white dark:bg-[#020617] border-2 border-black/5 dark:border-white/5 shadow-inner">
                {[
                  { id: 'list', icon: <List size={18} />, label: 'GRID VIEW' },
                  { id: 'kanban', icon: <Layout size={18} />, label: 'FLOW BOARD' },
                  { id: 'calendar', icon: <Calendar size={18} />, label: 'CHRONO' },
                  { id: 'map', icon: <MapIcon size={18} />, label: 'SPATIAL' },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setViewMode(v.id as any)}
                    className={clsx(
                      'flex items-center gap-3 px-6 py-3 rounded-[24px] text-xs font-black transition-all duration-500 tracking-[0.1em]',
                      viewMode === v.id 
                        ? 'bg-black text-white dark:bg-[#00d1ff] dark:text-black shadow-glow-white dark:shadow-glow-cyan' 
                        : 'text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                    )}
                  >
                    {v.icon} <span className="hidden xl:inline">{v.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 flex-1 lg:max-w-md px-4">
                <div className="relative w-full group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black dark:group-focus-within:text-[#00d1ff] transition-colors" />
                  <input 
                    placeholder="SCAN INTELLIGENCE FEED..."
                    className="w-full bg-white dark:bg-[#020617] border-2 border-black/5 dark:border-white/10 rounded-[32px] pl-12 pr-6 py-3.5 text-sm font-bold text-black dark:text-white focus:border-black dark:focus:border-[#00d1ff] outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 shadow-inner"
                    value={searchQuery}
                    onChange={e => setFilter('searchQuery', e.target.value)}
                  />
                </div>
              </div>
            </Card>

            <AnimatePresence mode="wait">
              {viewMode === 'list' && (
                <motion.div 
                  key="list-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {loading ? Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-[32px]" />) : (
                    filtered.map((c, i) => (
                      <motion.div 
                        key={c.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link to={`/complaints/track/${c.referenceId}`}>
                          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[32px] border-2 border-black/5 dark:border-white/5 hover:border-black dark:hover:border-[#00d1ff] transition-all duration-500 group cursor-pointer flex flex-col md:flex-row md:items-center gap-8 shadow-sm hover:shadow-2xl">
                            <div className="w-20 h-20 rounded-[24px] bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center text-5xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                              {CATEGORY_META[c.category].icon}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-4 mb-3">
                                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{c.referenceId}</span>
                                <Badge variant={STATUS_META[c.status].label === 'Resolved' ? 'success' : 'info'} className="px-4 py-1">
                                  {STATUS_META[c.status].label.toUpperCase()}
                                </Badge>
                                {c.severity >= 7 && <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
                              </div>
                              <h4 className="text-2xl font-black text-black dark:text-white tracking-tight group-hover:text-black dark:group-hover:text-[#00d1ff] transition-colors leading-tight">
                                {c.title}
                              </h4>
                              <div className="flex items-center gap-6 mt-4">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapIcon size={12} className="text-black dark:text-[#00d1ff]" /> {c.ward}</p>
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} className="text-black dark:text-[#00d1ff]" /> {format(new Date(c.createdAt), 'MMM d, yyyy')}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-6 border-t-2 md:border-t-0 md:border-l-2 border-black/5 dark:border-white/5 pt-6 md:pt-0 md:pl-10">
                              <div className="text-right">
                                <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Social Trust</p>
                                <p className="text-xl font-black text-black dark:text-white mt-1">👍 {c.upvotes}</p>
                              </div>
                              <div className="w-12 h-12 rounded-full bg-black dark:bg-[#00d1ff] flex items-center justify-center text-white dark:text-black shadow-glow-white dark:shadow-glow-cyan group-hover:translate-x-2 transition-transform duration-500">
                                <ChevronRight size={24} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))
                  )}
                  {filtered.length === 0 && !loading && (
                    <div className="py-32 text-center bg-slate-50 dark:bg-white/5 rounded-[48px] border-4 border-dashed border-black/5 dark:border-white/10">
                      <div className="text-8xl mb-8 grayscale opacity-20">🔎</div>
                      <h3 className="text-2xl font-black text-black dark:text-white mb-3 uppercase tracking-tighter">Zero Intelligence</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Modify signal parameters or clear filters</p>
                    </div>
                  )}
                </motion.div>
              )}

              {viewMode === 'kanban' && (
                <motion.div key="kanban-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <KanbanBoard complaints={myComplaints} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Panel */}
          <div className="lg:col-span-4 space-y-12">
            {/* Insights Heatmap */}
            <ActivityHeatmap />

            {/* Achievements Section */}
            <Card className="p-8 border-2 border-black dark:border-white/5 bg-white dark:bg-[#0f172a] shadow-premium relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Award size={120} className="text-black dark:text-[#00d1ff]" />
              </div>
              <h3 className="text-[10px] font-black text-black dark:text-white mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
                <Award size={16} className="text-amber-500" /> Honor Badges
              </h3>
              <div className="grid grid-cols-3 gap-6 relative z-10">
                {user?.badges.map(b => (
                  <motion.div 
                    key={b.id}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-20 h-20 rounded-[24px] bg-slate-50 dark:bg-white/5 flex items-center justify-center text-4xl shadow-inner border border-black/5 dark:border-white/10 group/badge">
                      <span className="group-hover/badge:scale-125 transition-transform duration-500">{b.icon}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-500 text-center leading-tight uppercase tracking-widest">{b.name}</span>
                  </motion.div>
                ))}
                <div className="flex flex-col items-center gap-3 opacity-20 grayscale cursor-not-allowed">
                  <div className="w-20 h-20 rounded-[24px] bg-slate-100 dark:bg-white/5 border-2 border-dashed border-black/10 dark:border-white/20 flex items-center justify-center text-4xl">
                    🔒
                  </div>
                  <span className="text-[10px] font-black text-slate-400 text-center uppercase tracking-widest">Locked</span>
                </div>
              </div>
              <Button variant="outline" size="md" className="w-full mt-10 border-2 border-black dark:border-white/10 font-black uppercase tracking-[0.2em] text-[10px]">Expand Portfolio</Button>
            </Card>

            {/* Quick Actions */}
            <Card className="p-8 border-2 border-black dark:border-white/5 bg-slate-50 dark:bg-white/5 shadow-premium">
              <h3 className="text-[10px] font-black text-black dark:text-white mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                <Plus size={16} className="text-black dark:text-[#00d1ff]" /> Terminal Links
              </h3>
              <div className="space-y-3">
                {[
                  { icon: <Download size={18} />, label: 'DUMP ACTIVITY DATA (PDF)' },
                  { icon: <Bell size={18} />, label: 'ALERT CONFIGURATION' },
                  { icon: <Share2 size={18} />, label: 'DEPLOY NETWORK INVITE' },
                  { icon: <FileText size={18} />, label: 'ACCESS PUBLIC LEDGER' },
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-5 rounded-[24px] bg-white dark:bg-[#020617] border-2 border-black/5 dark:border-white/10 hover:border-black dark:hover:border-[#00d1ff] transition-all duration-300 group text-left shadow-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 group-hover:text-black dark:group-hover:text-[#00d1ff] transition-colors">{item.icon}</span>
                      <span className="text-[10px] text-slate-500 group-hover:text-black dark:group-hover:text-white font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
