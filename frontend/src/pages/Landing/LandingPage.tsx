import React from 'react'
import { motion } from 'framer-motion'
import { HeroSection } from '../../components/landing/HeroSection'
import { LiveTicker } from '../../components/landing/LiveTicker'
import { CategoryPills } from '../../components/landing/CategoryPills'
import { LandingStats } from '../../components/landing/LandingStats'
import { ActivityFeed } from '../../components/landing/ActivityFeed'
import { TestimonialCarousel } from '../../components/landing/TestimonialCarousel'
import { WARDS } from '../../utils/mockData'
import { Button } from '../../components/ui'
import { Link } from 'react-router-dom'
import { Trophy, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <HeroSection />
      <LiveTicker />
      <CategoryPills />
      <LandingStats />
      
      {/* Featured Section: Top Wards */}
      <section className="py-24 px-4 overflow-hidden relative">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-amber/10 flex items-center justify-center text-2xl text-brand-amber">🏆</div>
              <h3 className="text-xl font-bold text-brand-amber uppercase tracking-widest">Public Leaderboard</h3>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
              Honoring Our Top <br />Performing Wards
            </h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              We track resolution rates across every zone to ensure accountability. 
              These wards lead the city in responsiveness and citizen satisfaction.
            </p>
            <Link to="/analytics">
              <Button variant="outline" size="lg" rightIcon={<ArrowRight size={18} />}>
                View Full City Analytics
              </Button>
            </Link>
          </motion.div>

          <div className="space-y-4">
            {WARDS.slice(0, 4).sort((a, b) => b.slaComplianceRate - a.slaComplianceRate).map((ward, i) => (
              <motion.div
                key={ward.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-3xl border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-black text-slate-800 font-display">0{i + 1}</span>
                  <div>
                    <h4 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">{ward.name}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold">{ward.officerCount} Active Officers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white font-display">{ward.slaComplianceRate}%</p>
                  <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">SLA Success</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ActivityFeed />
      <TestimonialCarousel />

      {/* Final CTA */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-500/5" />
        <div className="max-w-4xl mx-auto relative z-10 text-center glass p-16 rounded-[4rem] border border-white/10 shadow-2xl">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to make a difference?</h2>
          <p className="text-xl text-slate-400 mb-12">
            Join 50,000+ citizens and officers working together to build a better future.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register"><Button size="xl" glow>Create Your Account</Button></Link>
            <Link to="/about"><Button variant="ghost" size="xl">Learn More</Button></Link>
          </div>
        </div>
      </section>

      {/* Footer Placeholder for completeness */}
      <footer className="bg-dark-950 border-t border-white/5 py-12 px-4">
        {/* Simplified for brevity, usually a complex footer component */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-xl">👁️</div>
            <span className="font-bold text-xl text-white">CivicEye</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="text-sm text-slate-600">© 2024 CivicEye. Government of India Initiative.</p>
        </div>
      </footer>
    </div>
  )
}
