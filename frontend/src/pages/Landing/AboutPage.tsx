import React from 'react'
import { motion } from 'framer-motion'
import { Card, Badge, Button } from '../../components/ui'
import { Shield, Target, Users, Zap, Globe, Heart, CheckCircle2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AboutPage() {
  const values = [
    { icon: <Target className="text-primary-500" />, title: 'Transparency', desc: 'Every report is public and trackable. No hidden delays, no ignored concerns.' },
    { icon: <Zap className="text-yellow-500" />, title: 'Efficiency', desc: 'AI-powered routing ensures your complaint reaches the right department in seconds.' },
    { icon: <Shield className="text-emerald-500" />, title: 'Accountability', desc: 'Officers are rated on resolution speed and quality, ensuring high performance.' },
  ]

  const milestones = [
    { year: 'Phase 1', title: 'Citizen Reporting', desc: 'Launch of the mobile-first reporting platform for all 15 wards.' },
    { year: 'Phase 2', title: 'Officer Integration', desc: 'Full digital workflow for maintenance staff and inspectors.' },
    { year: 'Phase 3', title: 'AI Automation', desc: 'Implementation of smart image recognition for automatic issue categorization.' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 pt-32 pb-20 px-6 overflow-hidden relative transition-colors duration-500">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-violet/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500 dark:text-slate-400 mb-8 uppercase tracking-widest"
          >
            <Globe size={14} className="text-primary-500 dark:text-primary-400" /> Shaping the Future of Governance
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 font-display leading-tight">
            Building a <span className="gradient-text">Smater City,</span> <br /> One Report at a Time.
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            UnIgnored is a revolutionary platform designed to empower citizens and streamline government responsiveness. 
            We believe that technology can bridge the gap between public needs and administrative action.
          </p>
        </div>

        {/* Mission Card */}
        <Card className="p-12 mb-24 relative overflow-hidden bg-primary-500/5 border-slate-200 dark:border-primary-500/20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                To create a transparent, data-driven ecosystem where every citizen feels heard and every public 
                resource is utilized with maximum efficiency. We're not just tracking complaints; we're 
                building a legacy of trust.
              </p>
              <div className="space-y-4">
                {['Direct interaction with authorities', 'Real-time resolution proof', 'Public satisfaction rankings'].map(item => (
                  <div key={item} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 size={20} className="text-primary-500" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-white/5 text-center">
                  <p className="text-4xl font-black text-slate-900 dark:text-white mb-1">50K+</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Residents</p>
                </div>
                <div className="p-8 rounded-[2rem] bg-primary-500/10 dark:bg-primary-500/20 border border-primary-500/30 text-center shadow-lg dark:shadow-glow-blue">
                  <p className="text-4xl font-black text-primary-600 dark:text-white mb-1">98%</p>
                  <p className="text-xs text-primary-700 dark:text-white uppercase tracking-widest font-bold">Satisfaction</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-8 rounded-[2rem] bg-brand-violet/10 dark:bg-brand-violet/20 border border-brand-violet/30 text-center shadow-lg dark:shadow-glow-violet">
                  <p className="text-4xl font-black text-brand-violet dark:text-white mb-1">15</p>
                  <p className="text-xs text-brand-violet-700 dark:text-white uppercase tracking-widest font-bold">Active Wards</p>
                </div>
                <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-white/5 text-center">
                  <p className="text-4xl font-black text-slate-900 dark:text-white mb-1">2.4h</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Response</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Core Values */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">The UnIgnored Principles</h2>
            <p className="text-slate-500">The values that drive our innovation and city management.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-8 h-full flex flex-col items-center text-center bg-white dark:bg-transparent border-slate-200 dark:border-white/10 hover:border-primary-500/30 transition-all group">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {v.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{v.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm">{v.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Roadmap / Timeline */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Journey of Change</h2>
            <p className="text-slate-500">Our roadmap for a futuristic, responsive city.</p>
          </div>
          <div className="relative pl-8 border-l border-slate-200 dark:border-white/10 space-y-16 max-w-2xl mx-auto">
            {milestones.map((m, i) => (
              <motion.div 
                key={i} 
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-primary-500 shadow-glow-blue border-4 border-white dark:border-dark-950" />
                <Badge variant="info" className="mb-4">{m.year}</Badge>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{m.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-24 border-t border-slate-200 dark:border-white/5">
          <Heart className="text-rose-500 mx-auto mb-6 animate-pulse" size={40} />
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Let's build a better city together.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register"><Button size="lg" glow>Join the Movement</Button></Link>
            <Link to="/contact"><Button variant="outline" size="lg">Partner with Us</Button></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
