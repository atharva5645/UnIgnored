import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import { 
  Users, ClipboardList, CheckCircle, AlertTriangle, 
  TrendingUp, Map as MapIcon, Calendar, Search, 
  Filter, Download, MoreHorizontal, ArrowUpRight,
  Shield, Building2, UserCheck, Clock, Zap, Activity
} from 'lucide-react'
import { Card, StatCard, Badge, Button, Avatar, ProgressBar } from '../../components/ui'
import { COMPLAINTS, WARDS, OFFICERS, STATUS_META } from '../../utils/mockData'
import { clsx } from 'clsx'
import { useAuthStore } from '../../store/authStore'
import { useComplaints } from '../../hooks/useComplaints'
import { format } from 'date-fns'

const COLORS = ['#00d1ff', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e']

const chartData = [
  { name: 'MON', count: 45, resolved: 32 },
  { name: 'TUE', count: 52, resolved: 38 },
  { name: 'WED', count: 61, resolved: 45 },
  { name: 'THU', count: 58, resolved: 50 },
  { name: 'FRI', count: 72, resolved: 55 },
  { name: 'SAT', count: 48, resolved: 40 },
  { name: 'SUN', count: 35, resolved: 30 },
]

const categoryData = [
  { name: 'POTHOLE', value: 35 },
  { name: 'GARBAGE', value: 25 },
  { name: 'WATER', value: 20 },
  { name: 'POWER', value: 15 },
  { name: 'SAFETY', value: 5 },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState<'analytics' | 'management' | 'users'>('analytics')
  const { user } = useAuthStore()
  const { complaints } = useComplaints()
  const isZonal = user?.role === 'zonal_admin'
  const areaName = isZonal ? 'North Ward' : 'Central Hub'

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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[12px] bg-black dark:bg-[#00d1ff] flex items-center justify-center text-white dark:text-black">
                <Shield size={20} />
              </div>
              <h1 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-[0.4em]">
                System Console <span className="text-slate-400 dark:text-slate-600 mx-2">/</span> {areaName}
              </h1>
            </div>
            <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
              Operational <span className="text-slate-400 dark:text-slate-600">Overview</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/5 p-2 rounded-[24px] border-2 border-black/5 dark:border-white/5">
            {[
              { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={16} /> },
              { id: 'management', label: 'Complaints', icon: <ClipboardList size={16} /> },
              { id: 'users', label: 'Officers', icon: <Users size={16} /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={clsx(
                  'flex items-center gap-3 px-8 py-4 rounded-[18px] text-xs font-black uppercase tracking-widest transition-all duration-500',
                  tab === t.id 
                    ? 'bg-black text-white dark:bg-[#00d1ff] dark:text-black shadow-premium' 
                    : 'text-slate-400 hover:text-slate-800 dark:hover:text-white'
                )}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          <StatCard label="Total Reports" value={complaints.length} icon="📋" trend={12} color="info" />
          <StatCard label="Resolved" value={complaints.filter(c => c.status === 'resolved').length} icon="✅" trend={8} color="success" />
          <StatCard label="Active Officers" value={OFFICERS.filter(o => o.status === 'on_duty').length} icon="👮" trend={5} color="warning" />
          <StatCard label="Response Rate" value="94.2%" icon="⚡" trend={2} color="error" />
        </div>

        <AnimatePresence mode="wait">
          {tab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <Card className="lg:col-span-2 p-10 border-2 border-black dark:border-white/5 shadow-premium bg-white dark:bg-[#0f172a]">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-[0.3em] flex items-center gap-4">
                    <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-[12px]">
                      <Activity size={20} className="text-slate-800 dark:text-[#00d1ff]" />
                    </div>
                    Signal Velocity
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#00d1ff]" />
                      <span className="text-[10px] font-black text-slate-400 uppercase">Incoming</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-white/10" />
                      <span className="text-[10px] font-black text-slate-400 uppercase">Resolved</span>
                    </div>
                  </div>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00d1ff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00d1ff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          border: 'none', 
                          borderRadius: '16px', 
                          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                          padding: '12px'
                        }}
                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 900 }}
                        labelStyle={{ color: '#64748b', marginBottom: '8px', fontSize: '10px' }}
                      />
                      <Area type="monotone" dataKey="count" stroke="#00d1ff" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                      <Area type="monotone" dataKey="resolved" stroke="#e2e8f0" strokeWidth={2} fill="transparent" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-10 border-2 border-black dark:border-white/5 shadow-premium bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                  <PieChart width={200} height={200}>
                    <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-12 flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-white/10 rounded-[12px]">
                    <Zap size={20} className="text-[#00d1ff]" />
                  </div>
                  Sector Distribution
                </h3>
                <div className="space-y-8 relative z-10">
                  {categoryData.map((cat, i) => (
                    <div key={cat.name} className="group cursor-pointer">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 group-hover:text-white transition-colors">{cat.name}</span>
                        <span className="text-xs font-black text-[#00d1ff]">{cat.value}%</span>
                      </div>
                      <ProgressBar progress={cat.value} color={i === 0 ? 'info' : i === 1 ? 'secondary' : 'success'} size="sm" className="bg-white/5" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-12 border-white/10 text-white font-black text-[10px] hover:bg-white/5 uppercase tracking-widest">Generate Report</Button>
              </Card>
            </motion.div>
          )}

          {tab === 'management' && (
            <motion.div 
              key="management"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-10 border-2 border-black dark:border-white/5 shadow-premium bg-white dark:bg-[#0f172a]">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-[0.3em] flex items-center gap-4">
                    <div className="p-3 bg-black dark:bg-[#00d1ff] rounded-[12px] text-white dark:text-black">
                      <ClipboardList size={20} />
                    </div>
                    Active Registry
                  </h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group min-w-[300px]">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black dark:group-focus-within:text-[#00d1ff] transition-colors" />
                      <input placeholder="SEARCH LEDGER..." className="w-full bg-slate-50 dark:bg-white/5 border-2 border-black/5 dark:border-white/10 rounded-[24px] pl-12 pr-6 py-3 text-xs font-bold text-slate-800 dark:text-white focus:border-slate-800 dark:focus:border-[#00d1ff] outline-none shadow-inner" />
                    </div>
                    <Button size="xl" variant="outline" className="border-2 border-black dark:border-white/10"><Download size={18} /></Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b-2 border-black/10 dark:border-white/10">
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">IDENTIFIER</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">REPORTER</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">SECTOR</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">STATUS</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">TIMELOCK</th>
                        <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-black/5 dark:divide-white/5">
                      {complaints.slice(0, 10).map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                          <td className="py-6">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tighter">{c.title}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{c.referenceId}</span>
                            </div>
                          </td>
                          <td className="py-6">
                            <div className="flex items-center gap-3">
                              <Avatar name={c.citizenName} size="xs" />
                              <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase">{c.citizenName}</span>
                            </div>
                          </td>
                          <td className="py-6">
                            <Badge variant="info" className="bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-none uppercase text-[9px] tracking-widest">{c.category}</Badge>
                          </td>
                          <td className="py-6">
                            <Badge variant={STATUS_META[c.status as keyof typeof STATUS_META].color as any} className="uppercase text-[9px] tracking-widest px-3">
                              {c.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="py-6">
                            <span className="text-[10px] font-black text-slate-400 uppercase">{format(new Date(c.createdAt), 'MMM d, HH:mm')}</span>
                          </td>
                          <td className="py-6 text-right">
                            <button className="p-2 hover:bg-black hover:text-white dark:hover:bg-[#00d1ff] dark:hover:text-black rounded-full transition-all duration-300">
                              <ArrowUpRight size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button variant="ghost" className="w-full mt-10 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">View Full Registry</Button>
              </Card>
            </motion.div>
          )}

          {tab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-10 border-2 border-black dark:border-white/5 shadow-premium bg-white dark:bg-[#0f172a]">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-[0.3em] flex items-center gap-4">
                    <div className="p-3 bg-black dark:bg-[#00d1ff] rounded-[12px] text-white dark:text-black">
                      <Users size={20} />
                    </div>
                    Force Registry
                  </h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group min-w-[300px]">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black dark:group-focus-within:text-[#00d1ff] transition-colors" />
                      <input placeholder="SCAN OPERATIVES..." className="w-full bg-slate-50 dark:bg-white/5 border-2 border-black/5 dark:border-white/10 rounded-[24px] pl-12 pr-6 py-3 text-xs font-bold text-slate-800 dark:text-white focus:border-slate-800 dark:focus:border-[#00d1ff] outline-none shadow-inner" />
                    </div>
                    <Button size="xl" variant="primary" className="shadow-glow-white dark:shadow-glow-cyan px-10">ENROLL ENTITY</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {OFFICERS.map((o) => (
                    <Card key={o.id} className="p-8 border-2 border-black dark:border-white/10 hover:border-black dark:hover:border-[#00d1ff] transition-all duration-500 group bg-slate-50 dark:bg-white/5">
                      <div className="flex items-start justify-between mb-8">
                        <Avatar name={o.name} src={o.avatar} size="xl" className="border-4 border-white dark:border-[#0f172a] shadow-lg group-hover:scale-110 transition-transform" />
                        <Badge variant={o.status === 'on_duty' ? 'success' : 'info'}>{o.status.replace('_', ' ')}</Badge>
                      </div>
                      <h4 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter uppercase mb-1">{o.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{o.ward || 'CENTRAL SECTOR'}</p>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black">
                          <span className="text-slate-400 uppercase tracking-widest">Active Tasks</span>
                          <span className="text-slate-800 dark:text-white">12 / 15</span>
                        </div>
                        <ProgressBar progress={80} color="info" size="xs" className="bg-slate-200 dark:bg-white/10" />
                      </div>
                      <div className="flex items-center gap-3 mt-8">
                        <Button variant="outline" size="sm" className="flex-1 text-[9px] border-2 border-black dark:border-white/10 uppercase tracking-widest font-black">Profile</Button>
                        <Button variant="outline" size="sm" className="flex-1 text-[9px] border-2 border-black dark:border-white/10 uppercase tracking-widest font-black">Deploy</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
