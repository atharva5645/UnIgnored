import React from 'react'
import { motion } from 'framer-motion'
import { COMPLAINTS, CATEGORY_META, STATUS_META } from '../../utils/mockData'
import { Badge, Card } from '../ui'
import { formatDistanceToNow } from 'date-fns'

export function ActivityFeed() {
  const latest = COMPLAINTS.slice(0, 5)
  
  return (
    <section className="py-24 px-4 bg-slate-50 dark:bg-dark-900/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Real-Time Action</h2>
          <p className="text-slate-600 dark:text-slate-400">See what's being resolved in your community right now.</p>
        </div>

        <div className="space-y-4">
          {latest.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="glass p-5 rounded-3xl border border-slate-200 dark:border-white/5 flex items-center gap-6 bg-white dark:bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {CATEGORY_META[c.category].icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-600">{c.referenceId}</span>
                    <Badge variant={c.status === 'resolved' ? 'success' : 'info'}>
                      {STATUS_META[c.status].label}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{c.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{c.location.address}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-slate-500 dark:text-slate-600 uppercase tracking-widest font-bold">Updated</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{formatDistanceToNow(new Date(c.updatedAt))} ago</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
