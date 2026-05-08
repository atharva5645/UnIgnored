import React from 'react'
import { motion } from 'framer-motion'
import { TESTIMONIALS } from '../../utils/mockData'
import { Avatar, Card } from '../ui'

export function TestimonialCarousel() {
  return (
    <section className="py-24 px-4 overflow-hidden relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Trusted by Thousands</h2>
          <p className="text-slate-400">Join the movement for a cleaner, smarter city.</p>
        </div>

        <div className="flex gap-8 animate-ticker hover:[animation-play-state:paused] w-max">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <Card key={i} className="w-[400px] flex-shrink-0 bg-white/5 border-white/5 hover:border-primary-500/30 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <Avatar name={t.name} src={t.avatar} size="md" />
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
              <p className="text-slate-400 italic leading-relaxed">"{t.text}"</p>
              <div className="flex gap-1 mt-4 text-yellow-500 text-sm">
                {Array(5).fill(0).map((_, i) => <span key={i}>★</span>)}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
