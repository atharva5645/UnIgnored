import React from 'react'
import { motion } from 'framer-motion'
import { Card, Button, Badge } from '../../components/ui'
import { Link } from 'react-router-dom'
import { 
  Mail, Phone, MapPin, Send, 
  MessageSquare, Globe, ArrowRight,
  Twitter, Github, Linkedin, HelpCircle
} from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 pt-32 pb-20 px-6 relative overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-screen bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent opacity-50 -z-10" />

      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Contact Info */}
          <div className="space-y-12">
            <div>
              <Badge variant="info" className="mb-4">Get in Touch</Badge>
              <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 font-display">Let's Talk <br />Citizenship.</h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-md">
                Have questions about the platform, partnership opportunities, or need help with a report? 
                Our team is here to help 24/7.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: <Mail size={20} />, label: 'Email Support', value: 'help@UnIgnored.gov.in' },
                { icon: <Phone size={20} />, label: 'Helpline', value: '+91 11 2345 6789' },
                { icon: <MapPin size={20} />, label: 'Headquarters', value: 'NITI Aayog, Sansad Marg, New Delhi' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-6 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary-500 border border-slate-200 dark:border-white/5 group-hover:border-primary-500/50 transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.label}</p>
                    <p className="text-slate-900 dark:text-white font-medium group-hover:text-primary-400 transition-colors">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-12 border-t border-slate-200 dark:border-white/5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Social Channels</p>
              <div className="flex gap-4">
                {[<Twitter size={20} />, <Github size={20} />, <Linkedin size={20} />].map((icon, i) => (
                  <button key={i} className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/5">
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <Card className="p-10 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-2xl relative">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-500">
                <MessageSquare size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest">Send a Message</h2>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                  <input placeholder="John Doe" className="w-full bg-slate-50 dark:bg-dark-950/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary-500/50 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                  <input placeholder="john@example.com" className="w-full bg-slate-50 dark:bg-dark-950/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:border-primary-500/50 outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Subject</label>
                <select className="w-full bg-slate-50 dark:bg-dark-950/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none">
                  <option>Partnership Inquiry</option>
                  <option>Technical Support</option>
                  <option>Press & Media</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Message</label>
                <textarea 
                  placeholder="Tell us how we can help..." 
                  className="w-full bg-slate-50 dark:bg-dark-950/50 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm text-slate-900 dark:text-white focus:border-primary-500/50 outline-none transition-all resize-none"
                  rows={5}
                />
              </div>

              <Button size="xl" className="w-full" glow>
                Send Inquiry <Send size={18} className="ml-2" />
              </Button>
            </form>

            <div className="mt-10 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center gap-4">
              <HelpCircle size={24} className="text-primary-500 dark:text-primary-400" />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest">Looking for FAQs?</p>
                <p className="text-[10px] text-slate-500 mt-1">Common issues and answers are listed in our <Link to="/help" className="text-primary-500 dark:text-primary-400 underline">Help Center</Link>.</p>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
