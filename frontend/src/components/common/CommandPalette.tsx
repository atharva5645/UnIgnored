import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Command, Map, Plus, BarChart, Settings, User, HelpCircle, FileText, Layout, Bell, Globe } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../../store/uiStore'
import { useAuthStore } from '../../store/authStore'
import { clsx } from 'clsx'

const COMMANDS = [
  { id: 'new_complaint', label: 'File a New Complaint', icon: <Plus size={18} />, path: '/complaints/new', category: 'Actions' },
  { id: 'track_id', label: 'Track Complaint by ID', icon: <Search size={18} />, path: '/complaints/track', category: 'Actions' },
  { id: 'view_map', label: 'Open Civic Map', icon: <Map size={18} />, path: '/complaints/map', category: 'Views' },
  { id: 'analytics', label: 'View Public Analytics', icon: <BarChart size={18} />, path: '/analytics', category: 'Views' },
  { id: 'dashboard', label: 'Go to My Dashboard', icon: <Layout size={18} />, path: '/dashboard/citizen', category: 'Navigation' },
  { id: 'profile', label: 'Edit My Profile', icon: <User size={18} />, path: '/profile', category: 'Navigation' },
  { id: 'settings', label: 'Account Settings', icon: <Settings size={18} />, path: '/profile/settings', category: 'Navigation' },
  { id: 'help', label: 'Help & FAQ', icon: <HelpCircle size={18} />, path: '/faq', category: 'Information' },
  { id: 'privacy', label: 'Privacy Policy', icon: <FileText size={18} />, path: '/privacy', category: 'Information' },
  { id: 'lang_hi', label: 'Switch to Hindi', icon: <Globe size={18} />, action: () => alert('Hindi selected'), category: 'Preferences' },
  { id: 'toggle_theme', label: 'Toggle Dark/Light Mode', icon: <Command size={18} />, action: () => {}, category: 'Preferences' },
]

export function CommandPalette() {
  const { commandPaletteOpen: isOpen, setCommandPalette: setOpen, toggleDarkMode } = useUIStore()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(!isOpen)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setOpen])

  const filtered = COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))

  const handleSelect = (command: typeof COMMANDS[0]) => {
    if (command.path) navigate(command.path)
    if (command.action) command.action()
    if (command.id === 'toggle_theme') toggleDarkMode()
    setOpen(false)
    setQuery('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/80 dark:bg-[#020617]/90 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] border-2 border-black dark:border-white/10 rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div className="flex items-center gap-4 px-8 py-6 border-b-2 border-black/5 dark:border-white/5 bg-slate-50 dark:bg-white/5">
              <Command size={24} className="text-black dark:text-[#f59e0b]" />
              <input 
                autoFocus
                placeholder="Search commands, navigate, or perform actions..." 
                className="w-full bg-transparent border-none outline-none text-xl font-black text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-black dark:bg-[#f59e0b] text-[10px] text-white dark:text-black font-black uppercase tracking-widest">
                ESC
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="text-6xl mb-6 filter grayscale">🔍</div>
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No intelligence found for "{query}"</p>
                </div>
              ) : (
                Object.entries(
                  filtered.reduce((acc, cmd) => {
                    if (!acc[cmd.category]) acc[cmd.category] = []
                    acc[cmd.category].push(cmd)
                    return acc
                  }, {} as Record<string, typeof COMMANDS>)
                ).map(([category, cmds]) => (
                  <div key={category} className="mb-6 last:mb-0">
                    <div className="px-6 py-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-2">{category}</div>
                    <div className="space-y-1.5">
                      {cmds.map((cmd) => (
                        <button
                          key={cmd.id}
                          onClick={() => handleSelect(cmd)}
                          className="w-full flex items-center justify-between px-6 py-4 rounded-[24px] hover:bg-black hover:text-white dark:hover:bg-[#f59e0b] dark:hover:text-black group transition-all duration-300 border border-transparent hover:border-black dark:hover:border-white/10"
                        >
                          <div className="flex items-center gap-5">
                            <div className="text-slate-400 group-hover:text-inherit transition-colors">
                              {cmd.icon}
                            </div>
                            <span className="text-base font-bold tracking-tight">
                              {cmd.label}
                            </span>
                          </div>
                          <span className="text-[10px] font-black opacity-40 group-hover:opacity-100 uppercase tracking-widest">
                            {cmd.category}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-8 py-5 border-t-2 border-black/5 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex items-center justify-between">
              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="px-2 py-1 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 text-black dark:text-white shadow-sm">↑↓</span> Navigate
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="px-2 py-1 rounded-lg bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 text-black dark:text-white shadow-sm">ENTER</span> Select
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">UnIgnored v2.0</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

