import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line
} from 'recharts'
import { 
  Users, ClipboardList, CheckCircle, AlertTriangle, 
  TrendingUp, Map as MapIcon, Calendar, Search, 
  Filter, Download, MoreHorizontal, ArrowUpRight,
  Shield, Building2, UserCheck, Clock, Zap
} from 'lucide-react'
import { Card, StatCard, Badge, Button, Avatar, ProgressBar } from '../../components/ui'
import { COMPLAINTS, WARDS, OFFICERS, STATUS_META } from '../../utils/mockData'
import { clsx } from 'clsx'
import { useAuthStore } from '../../store/authStore'
import { useComplaints } from '../../hooks/useComplaints'
import { format } from 'date-fns'

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e']

// Mock Data for Charts
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
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="info" className="bg-black text-white dark:bg-[#00d1ff] dark:text-black px-4 py-1.5 shadow-glow-white dark:shadow-glow-cyan">
                {isZonal ? 'ZONAL AUTHORITY' : 'GLOBAL OVERWATCH'}
              </Badge>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sector Monitoring Active</span>
            </div>
            <h1 className="text-6xl font-black text-black dark:text-white font-display tracking-tighter leading-none mb-4">
              {isZonal ? `Zonal HQ: ${areaName}` : 'Command Center'}
            </h1>
            <p className="text-lg text-slate-500 font-bold tracking-tight">Managing civic assets for <span className="text-black dark:text-white underline decoration-2 underline-offset-4">{areaName}</span> · {format(new Date(), 'MMMM d, yyyy')}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="xl" className="border-2 border-black dark:border-white/10 shadow-sm group">
              <Download size={20} className="mr-3 group-hover:-translate-y-1 transition-transform" /> DUMP LEDGER
            </Button>
            <Button size="xl" variant="primary" className="shadow-glow-white dark:shadow-glow-cyan group">
              <Zap size={20} className="mr-3 group-hover:scale-125 transition-transform" /> {isZonal ? 'WARD BROADCAST' : 'GLOBAL ALERT'}
            </Button>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <Card className="p-3 mb-16 border-2 border-black dark:border-white/5 bg-slate-50 dark:bg-white/5 rounded-[40px] w-fit">
          <div className="flex items-center gap-2 p-1.5 rounded-[32px] bg-white dark:bg-[#020617] border-2 border-black/5 dark:border-white/5 shadow-inner">
            {[
              { id: 'analytics', label: 'LIVE ANALYTICS', icon: <TrendingUp size={18} /> },
              { id: 'management', label: 'COMPLAINT DESK', icon: <ClipboardList size={18} /> },
              { id: 'users', label: 'USER DIRECTORY', icon: <Users size={18} /> },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={clsx(
                  'flex items-center gap-3 px-8 py-3.5 rounded-[24px] text-[10px] font-black transition-all duration-500 tracking-[0.1em]',
                  tab === t.id 
                    ? 'bg-black text-white dark:bg-[#00d1ff] dark:text-black shadow-glow-white dark:shadow-glow-cyan' 
                    : 'text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                )}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </Card>

        {tab === 'analytics' && (
          <div className="space-y-12">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard label="Sector Hotspots" value={complaints.length.toString()} icon="🔥" trend={14} />
              <StatCard label="Missions Resolved" value="452" icon="✅" trend={8} />
              <StatCard label="Avg. Latency" value="18.5m" icon="⚡" trend={-12} />
              <StatCard label="Workforce Load" value="84%" icon="👮" trend={2} />
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-12 gap-12">
              <Card className="lg:col-span-8 p-10 border-2 border-black dark:border-white/5 shadow-premium">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-[0.3em] flex items-center gap-4">
                    <div className="p-3 bg-black dark:bg-[#00d1ff] rounded-[12px] text-white dark:text-black">
                      <TrendingUp size={20} />
                    </div>
                    Resolution Velocity
                  </h3>
                  <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-white/5 rounded-[12px] border border-black/5 dark:border-white/10">
                    <Badge variant="info" className="bg-black text-white dark:bg-[#00d1ff] dark:text-black rounded-[8px]">DAILY</Badge>
                    <Badge variant="ghost" className="text-slate-400">WEEKLY</Badge>
                  </div>
                </div>
                <div className="h-96 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={clsx(document.documentElement.classList.contains('dark') ? '#00d1ff' : '#000000')} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={clsx(document.documentElement.classList.contains('dark') ? '#00d1ff' : '#000000')} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={clsx(document.documentElement.classList.contains('dark') ? '#ffffff05' : '#00000005')} vertical={false} />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} dy={15} />
                      <YAxis stroke="#94a3b8" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: clsx(document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff'), border: '2px solid black', borderRadius: '24px', padding: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: clsx(document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000'), fontWeight: '900', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="count" stroke={clsx(document.documentElement.classList.contains('dark') ? '#00d1ff' : '#000000')} strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                      <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={4} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="lg:col-span-4 p-10 border-2 border-black dark:border-white/5 shadow-premium flex flex-col">
                <h3 className="text-[10px] font-black text-black dark:text-white mb-12 uppercase tracking-[0.3em]">INTELLIGENCE MIX</h3>
                <div className="h-72 w-full flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        innerRadius={70}
                        outerRadius={95}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {categoryData.map((c, i) => (
                    <div key={c.name} className="flex flex-col p-4 rounded-[20px] bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{c.name}</span>
                      </div>
                      <span className="text-xl font-black text-black dark:text-white">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Zonal Performance */}
            <Card className="p-10 border-2 border-black dark:border-white/5 shadow-premium">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-[0.3em] flex items-center gap-4">
                  <div className="p-3 bg-black dark:bg-[#00d1ff] rounded-[12px] text-white dark:text-black">
                    <Building2 size={20} />
                  </div>
                  Zonal Readiness
                </h3>
                <Button variant="outline" size="sm" className="border-2 border-black dark:border-white/10 font-black text-[10px]">SPATIAL VIEW</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b-2 border-black/10 dark:border-white/10">
                      <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">WARD SECTOR</th>
                      <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ACTIVE SIGNALS</th>
                      <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">SLA COMPLIANCE</th>
                      <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">WORKFORCE</th>
                      <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">CITIZEN RATING</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black/5 dark:divide-white/5">
                    {WARDS.map((ward) => (
                      <tr key={ward.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                        <td className="py-8 font-black text-lg text-black dark:text-white tracking-tighter">{ward.name}</td>
                        <td className="py-8">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-black text-black dark:text-white">{ward.totalComplaints}</span>
                            <Badge variant="info" className="bg-slate-100 text-slate-500 rounded-full px-2">ACTIVE</Badge>
                          </div>
                        </td>
                        <td className="py-8">
                          <div className="flex items-center gap-4">
                            <div className="w-32">
                              <ProgressBar value={ward.slaComplianceRate} className={ward.slaComplianceRate > 85 ? 'bg-emerald-500' : 'bg-amber-500'} />
                            </div>
                            <span className="text-xs font-black text-black dark:text-white">{ward.slaComplianceRate}%</span>
                          </div>
                        </td>
                        <td className="py-8 text-sm font-bold text-slate-500">{ward.officerCount} UNITS</td>
                        <td className="py-8">
                          <div className="flex gap-1 text-amber-500 text-sm">
                            {Array(5).fill(0).map((_, i) => <span key={i}>★</span>)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {tab === 'management' && (
          <div className="space-y-12">
            <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                <Card className="overflow-hidden border-2 border-black dark:border-white/5 shadow-premium bg-white dark:bg-[#0f172a]">
                  <div className="p-8 border-b-2 border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-6 bg-slate-50 dark:bg-white/5">
                    <div className="flex items-center gap-6 flex-1 min-w-[300px]">
                      <div className="relative flex-1 group">
                        <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black dark:group-focus-within:text-[#00d1ff] transition-colors" />
                        <input 
                          placeholder="SCAN ALL DATA POINTS..." 
                          className="w-full bg-white dark:bg-[#020617] border-2 border-black/5 dark:border-white/10 rounded-[24px] pl-12 pr-6 py-3 text-sm font-bold text-black dark:text-white focus:border-black dark:focus:border-[#00d1ff] outline-none shadow-inner" 
                        />
                      </div>
                      <select className="bg-white dark:bg-[#020617] border-2 border-black/5 dark:border-white/10 rounded-[24px] px-6 py-3 text-[10px] font-black text-black dark:text-white uppercase tracking-widest outline-none shadow-inner">
                        <option>ALL SIGNALS</option>
                        <option>NEW ENTRIES</option>
                        <option>CRITICAL ESCALATIONS</option>
                      </select>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="info" className="bg-black text-white dark:bg-[#00d1ff] dark:text-black py-1.5">52 NEW</Badge>
                      <Badge variant="error" className="py-1.5 shadow-glow-error">12 CRITICAL</Badge>
                    </div>
                  </div>
                  
                  <div className="divide-y-2 divide-black/5 dark:divide-white/5">
                    {complaints.slice(0, 8).map((c) => (
                      <div key={c.id} className="p-8 flex items-center gap-8 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group cursor-pointer">
                        <div className="w-16 h-16 rounded-[20px] bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-inner">
                          {c.category === 'pothole' ? '🕳️' : '🗑️'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-4 mb-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{c.referenceId}</span>
                            <Badge variant={c.severity >= 7 ? 'error' : 'info'} className="px-3">S{c.severity}</Badge>
                          </div>
                          <h4 className="text-xl font-black text-black dark:text-white truncate group-hover:text-black dark:group-hover:text-[#00d1ff] transition-colors">{c.title}</h4>
                          <p className="text-xs text-slate-500 font-bold mt-1 flex items-center gap-2"><MapIcon size={12} /> {c.location.address}</p>
                        </div>
                        <div className="flex items-center gap-10">
                          <div className="hidden xl:block text-right">
                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">INTELLIGENCE SOURCE</p>
                            <p className="text-xs text-black dark:text-white mt-1 font-black uppercase">{c.citizenName}</p>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" size="md" className="border-2 border-black dark:border-white/10 font-black text-[10px] px-6">DETAILS</Button>
                            <Button size="md" variant="primary" className="bg-emerald-500 text-white dark:bg-[#00d1ff] dark:text-black shadow-sm font-black text-[10px] px-6">DEPLOY</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-4 space-y-12">
                <Card className="p-8 border-2 border-rose-500 bg-rose-500/5 shadow-glow-error">
                  <h3 className="text-[10px] font-black text-rose-600 dark:text-rose-400 mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                    <AlertTriangle size={20} className="animate-pulse" /> Critical Breaches
                  </h3>
                  <div className="space-y-6">
                    {[1, 2].map(i => (
                      <div key={i} className="bg-white dark:bg-[#020617] p-6 rounded-[24px] border-2 border-rose-500/20 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                          <AlertTriangle size={48} className="text-rose-500" />
                        </div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                          <Badge variant="error" className="shadow-none">SLA FAILURE</Badge>
                          <span className="text-[10px] font-black text-slate-400 uppercase">2m AGO</span>
                        </div>
                        <p className="text-lg font-black text-black dark:text-white tracking-tighter mb-1">CMP-2024-X992</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase leading-relaxed">Infrastructure damage at North Ward sector 4 has exceeded response SLA by 24h.</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-8 border-2 border-black dark:border-white/5 shadow-premium">
                  <h3 className="text-[10px] font-black text-black dark:text-white mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
                    <Shield size={20} className="text-black dark:text-[#00d1ff]" /> Deployment Status
                  </h3>
                  <div className="space-y-6">
                    {OFFICERS.map(o => (
                      <div key={o.id} className="flex items-center justify-between p-4 rounded-[20px] bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 group">
                        <div className="flex items-center gap-4">
                          <Avatar name={o.name} src={o.avatar} size="md" className="border-2 border-white dark:border-[#020617] group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-sm font-black text-black dark:text-white uppercase tracking-tight">{o.name.split(' ')[1]}</p>
                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{o.department}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={clsx('text-[8px] font-black uppercase tracking-widest', o.status === 'on_duty' ? 'text-emerald-500' : 'text-slate-400')}>
                            {o.status === 'on_duty' ? 'ACTIVE' : 'OFFLINE'}
                          </span>
                          <div className={clsx('w-3 h-3 rounded-full shadow-sm', o.status === 'on_duty' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-slate-300')} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="xl" className="w-full mt-10 border-2 border-black dark:border-white/10 font-black text-[10px]">MANAGE FLEET</Button>
                </Card>
              </div>
            </div>
          </div>
        )}

        {tab === 'users' && (
          <Card className="p-10 border-2 border-black dark:border-white/5 shadow-premium">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
              <h3 className="text-sm font-black text-black dark:text-white uppercase tracking-[0.3em] flex items-center gap-4">
                <div className="p-3 bg-black dark:bg-[#00d1ff] rounded-[12px] text-white dark:text-black">
                  <Users size={20} />
                </div>
                Network Registry
              </h3>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative group min-w-[300px]">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black dark:group-focus-within:text-[#00d1ff] transition-colors" />
                  <input placeholder="SCAN REGISTRY..." className="w-full bg-slate-50 dark:bg-white/5 border-2 border-black/5 dark:border-white/10 rounded-[24px] pl-12 pr-6 py-3 text-xs font-bold text-black dark:text-white focus:border-black dark:focus:border-[#00d1ff] outline-none shadow-inner" />
                </div>
                <Button size="xl" variant="primary" className="shadow-glow-white dark:shadow-glow-cyan px-10">ENROLL ENTITY</Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-black/10 dark:border-white/10">
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ENTITY IDENTITY</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">CLEARANCE</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ASSIGNED SECTOR</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">OPERATIONAL STATUS</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">LAST SIGNAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black/5 dark:divide-white/5">
                  {OFFICERS.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                      <td className="py-8">
                        <div className="flex items-center gap-6">
                          <Avatar name={o.name} src={o.avatar} size="lg" className="border-2 border-white dark:border-[#0f172a] group-hover:scale-110 transition-transform shadow-sm" />
                          <div>
                            <p className="text-lg font-black text-black dark:text-white tracking-tighter uppercase">{o.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{o.email || 'officer@UnIgnored.gov'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-8">
                        <Badge variant="info" className="bg-black text-white dark:bg-[#00d1ff] dark:text-black py-1 px-4 text-[10px]">FIELD OFFICER</Badge>
                      </td>
                      <td className="py-8 text-xs font-black text-slate-500 uppercase tracking-widest">{o.ward || 'CENTRAL SECTOR'}</td>
                      <td className="py-8">
                        <div className="flex items-center gap-3">
                          <div className={clsx('w-2 h-2 rounded-full', o.status === 'on_duty' ? 'bg-emerald-500 shadow-glow-emerald' : 'bg-slate-400')} />
                          <span className="text-[10px] text-black dark:text-white font-black uppercase tracking-[0.1em]">{o.status.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="py-8 text-[10px] font-black text-slate-400 uppercase">2h AGO</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
  )
}
