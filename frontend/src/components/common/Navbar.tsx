import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, User, Settings, LogOut, Sun, Moon, Command, Shield, Menu, X } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import { Avatar, Button, Badge } from '../ui'
import { clsx } from 'clsx'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const { darkMode, toggleDarkMode, toggleCommandPalette, notifications, sidebarOpen, toggleSidebar } = useUIStore()
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 py-3 px-6 transition-all duration-300',
        scrolled 
          ? clsx(
              'border-b shadow-2xl transition-colors duration-500',
              darkMode ? 'bg-[#020617]/90 border-white/5' : 'bg-white/90 border-slate-200'
            )
          : 'bg-transparent'
      )}
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="lg:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-xl shadow-glow-blue group-hover:scale-110 transition-transform text-slate-900 font-black">
              👁️
            </div>
            <span className="font-display font-black text-2xl tracking-tight text-slate-900 dark:text-white">UnIgnored</span>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <div className={clsx(
            'flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl border transition-all duration-300',
            searchFocused 
              ? 'bg-slate-100 dark:bg-white/10 border-primary-500/50 shadow-glow-blue' 
              : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'
          )}>
            <Search size={18} className="text-slate-400 dark:text-slate-500" />
            <input 
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={(e) => e.key === 'k' && (e.ctrlKey || e.metaKey) && toggleCommandPalette()}
              placeholder="Search complaints, wards, or officers..." 
              className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white w-full placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
            <div className="flex items-center gap-1 bg-white dark:bg-white/5 px-2 py-0.5 rounded-none border border-slate-200 dark:border-white/10">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">Ctrl K</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          
          <button onClick={toggleDarkMode} className="p-2.5 rounded-none hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative">
            <button className="p-2.5 rounded-none hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all relative border border-transparent hover:border-slate-200 dark:hover:border-white/10">
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-brand-rose rounded-full animate-pulse" />
              )}
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-2 hidden sm:block" />

          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 p-1 pr-3 rounded-none hover:bg-slate-100 dark:hover:bg-white/5 transition-all border border-transparent hover:border-slate-200 dark:hover:border-white/10"
              >
                <Avatar name={user!.name} src={user?.avatar} size="sm" />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">{user?.role.replace('_', ' ')}</p>
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 glass border border-slate-300 dark:border-white/10 rounded-none shadow-2xl z-20 p-2"
                    >
                      <div className="p-4 border-b border-slate-200 dark:border-white/5 mb-2">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="info">{user?.rewardPoints} Points</Badge>
                          <Badge variant="success">Level 4</Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {[
                          { icon: <User size={16} />, label: 'My Profile', path: '/profile' },
                          { icon: <Shield size={16} />, label: 'Admin Panel', path: '/dashboard/admin', show: user?.role === 'super_admin' || user?.role === 'zonal_admin' },
                          { icon: <Settings size={16} />, label: 'Settings', path: '/profile/settings' },
                        ].map(item => (item.show !== false && (
                          <button 
                            key={item.label}
                            onClick={() => { navigate(item.path); setProfileOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-none transition-all"
                          >
                            {item.icon} {item.label}
                          </button>
                        )))}
                      </div>
                      
                      <div className="h-px bg-slate-200 dark:bg-white/5 my-2" />
                      
                      <button 
                        onClick={() => { logout(); navigate('/'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-none transition-all font-bold"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"><Button variant="ghost" size="sm" className="text-slate-900 dark:text-white rounded-xl">Sign In</Button></Link>
              <Link to="/register"><Button size="sm" className="rounded-xl">Get Started</Button></Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
