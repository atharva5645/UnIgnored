import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COMPLAINTS, CATEGORY_META } from '../../utils/mockData'
import { clsx } from 'clsx'
import { Zap, CheckCircle2, AlertTriangle, Info } from 'lucide-react'

const TICKER_MESSAGES = [
  "🚨 New: Water leakage reported in East Ward (Sector 14)",
  "✅ Resolved: Street light fix completed on Main Street",
  "👮 Officer Rajesh is now responding to a Garbage complaint",
  "📱 5,000+ citizens registered this month!",
  "🏆 West Ward leads in resolution efficiency today!",
  "⚠️ Alert: Planned maintenance in Zone 4 tonight (8 PM - 12 AM)",
]

export function LiveTicker() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TICKER_MESSAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-dark-950 border-y border-white/5 py-3 relative overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20 whitespace-nowrap">
          <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Live Updates</span>
        </div>
        
        <div className="flex-1 overflow-hidden relative h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-sm text-slate-400 absolute inset-0"
            >
              {TICKER_MESSAGES[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest whitespace-nowrap">
          <span>Active Officers: 142</span>
          <span>SLA Compliance: 94.2%</span>
          <span>API Latency: 24ms</span>
        </div>
      </div>
    </div>
  )
}
