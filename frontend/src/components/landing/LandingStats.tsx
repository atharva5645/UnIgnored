import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { StatCard } from '../ui'

function Counter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      let startTime: number
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const progress = (timestamp - startTime) / (duration * 1000)
        if (progress < 1) {
          setCount(Math.floor(end * progress))
          requestAnimationFrame(animate)
        } else {
          setCount(end)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export function LandingStats() {
  return (
    <section className="py-20 px-4 bg-dark-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Complaints Filed', value: 12842, icon: '📋', trend: 12, color: 'from-blue-500/10 to-cyan-500/10' },
            { label: 'Issues Resolved', value: 10250, icon: '✅', trend: 8, color: 'from-green-500/10 to-emerald-500/10' },
            { label: 'Active Officers', value: 142, icon: '👮', trend: 3, color: 'from-amber-500/10 to-orange-500/10' },
            { label: 'Avg Resolution Time', value: 48, icon: '⏱️', suffix: ' hrs', color: 'from-violet-500/10 to-purple-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden bg-gradient-to-br ${stat.color}`}>
                <div className="text-4xl mb-4">{stat.icon}</div>
                <div className="flex items-end gap-2">
                  <h3 className="text-4xl font-black text-white font-display">
                    <Counter end={stat.value} />
                    {stat.suffix}
                  </h3>
                  {stat.trend && (
                    <span className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-0.5">
                      ↑{stat.trend}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">{stat.label}</p>
                
                {/* Decorative Elements */}
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
