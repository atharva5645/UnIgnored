import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ClipboardList, CheckCircle2, Clock, MapPin, 
  ChevronRight, Phone, MessageSquare, AlertTriangle,
  TrendingUp, Award, Layout, Navigation, Camera,
  MoreVertical, Filter, Search, Send, Check, User
} from 'lucide-react'
import { Card, StatCard, Badge, Button, Avatar, ProgressBar } from '../../components/ui'
import { COMPLAINTS, STATUS_META, CATEGORY_META } from '../../utils/mockData'
import { clsx } from 'clsx'
import { useAuthStore } from '../../store/authStore'
import { useComplaints } from '../../hooks/useComplaints'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

export default function OfficerDashboard() {
  const { user } = useAuthStore()
  const { complaints, updateStatus } = useComplaints()
  const [view, setView] = useState<'tasks' | 'map' | 'performance'>('tasks')
  const [sortBySla, setSortBySla] = useState(false)
  const [viewAll, setViewAll] = useState(false)
  
  // Officers should see active tasks. For prototyping, we show 'submitted', 'under_review', 'assigned', 'in_progress'
  let myTasks = complaints.filter(c => 
    c.status === 'assigned' || c.status === 'in_progress' || c.status === 'submitted' || c.status === 'under_review'
  )

  if (sortBySla) {
    myTasks.sort((a, b) => {
      if (!a.slaDeadline) return 1;
      if (!b.slaDeadline) return -1;
      return new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime();
    });
  }

  if (!viewAll) {
    myTasks = myTasks.slice(0, 10);
  }

  return (
    <div className="min-h-screen pb-20 pt-24 px-6">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-6">
            <Avatar name={user?.name || "Ramesh Kumar"} size="lg" className="w-20 h-20 bg-brand-violet shadow-glow-violet border-4 border-slate-200 dark:border-white/5" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-800 dark:text-white font-display">Duty Desk: {user?.name.split(' ')[0]}</h1>
                <Badge variant="success" className="ring-4 ring-emerald-500/10">On Duty</Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-500 font-bold tracking-tight mt-1">
                <span className="text-primary-600 dark:text-primary-400">{user?.ward || 'North Ward'}</span> · {user?.department || 'Roads & Infrastructure'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Tasks Column */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2 px-2">
               <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <ClipboardList size={16} className="text-primary-500" /> Priority Queue
              </h3>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSortBySla(!sortBySla)}
                  className={clsx(
                    "text-xs font-bold transition-colors",
                     sortBySla ? "text-primary-600 dark:text-primary-400" : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  )}
                >
                  {sortBySla ? 'SORT BY NEWEST' : 'SORT BY SLA'}
                </button>
                 <div className="w-px h-3 bg-slate-200 dark:bg-white/10" />
                <button 
                  onClick={() => setViewAll(!viewAll)}
                  className={clsx(
                    "text-xs font-bold transition-colors",
                     viewAll ? "text-primary-600 dark:text-primary-400" : "text-slate-500 hover:text-slate-800 dark:hover:text-white"
                  )}
                >
                  {viewAll ? 'VIEW TOP 10' : 'VIEW ALL'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {myTasks.map((task, i) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                   <Card className="p-6 border-slate-200 dark:border-white/5 hover:border-primary-500/30 transition-all group">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                       <div className="w-16 h-16 rounded-none bg-slate-100 dark:bg-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                        {CATEGORY_META[task.category].icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-mono text-slate-600 font-bold uppercase tracking-widest">{task.referenceId}</span>
                          <Badge variant={task.severity >= 7 ? 'error' : 'info'}>Sev {task.severity}</Badge>
                          <Badge variant="default" className="bg-brand-rose/10 text-brand-rose border border-brand-rose/20">
                            Due in 4h
                          </Badge>
                        </div>
                         <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-xs text-slate-500 flex items-center gap-1.5"><MapPin size={12} /> {task.location.address}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1.5"><User size={12} /> {task.citizenName}</p>
                        </div>
                      </div>

                       <div className="flex items-center gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/5 sm:pl-6">
                        <Link to={`/complaints/track/${task.referenceId}`}>
                          <Button size="sm" variant="outline">Navigate</Button>
                        </Link>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            updateStatus(
                              task.id, 
                              'resolved', 
                              user?.name || 'Field Officer', 
                              'officer', 
                              'Issue has been successfully resolved on the field.'
                            );
                          }}
                          className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
