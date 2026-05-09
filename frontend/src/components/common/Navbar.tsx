import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, User, Settings, LogOut, Sun, Moon, Command, Shield, Menu, X, Eye } from 'lucide-react'
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
        'fixed top-4 left-6 right-6 z-50 py-3 px-6 transition-all duration-500 rounded-[32px]',
        scrolled 
          ? clsx(
              'border shadow-2xl backdrop-blur-xl transition-all duration-500',
              darkMode 
                ? 'bg-[#020617]/80 border-white/10 shadow-glow-cyan/20' 
                : 'bg-white/80 border-black shadow-glow-white/20'
            )
          : clsx(
              'border transition-all duration-500',
              darkMode 
                ? 'bg-[#020617]/40 border-white/5' 
                : 'bg-white/40 border-slate-200'
            )
      )}
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-8">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="lg:hidden text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-[16px] bg-black dark:bg-[#00d1ff] flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform duration-500">
              <Eye className="w-6 h-6 text-white dark:text-black" />
            </div>
            <span className="font-display font-black text-2xl tracking-tighter text-black dark:text-white uppercase">CivicEye</span>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <div className={clsx(
            'flex items-center gap-3 w-full px-6 py-2.5 rounded-[20px] border transition-all duration-500',
            searchFocused 
              ? darkMode 
                ? 'bg-white/10 border-[#00d1ff] shadow-glow-cyan/20' 
                : 'bg-slate-50 border-black shadow-lg'
              : darkMode 
                ? 'bg-white/5 border-white/10' 
                : 'bg-slate-50 border-slate-200'
          )}>
            <Search size={18} className={searchFocused ? 'text-black dark:text-[#00d1ff]' : 'text-slate-400 dark:text-slate-500'} />
            <input 
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={(e) => e.key === 'k' && (e.ctrlKey || e.metaKey) && toggleCommandPalette()}
              placeholder="Search complaints, wards, or officers..." 
              className="bg-transparent border-none outline-none text-sm font-medium text-black dark:text-white w-full placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
            <div className="flex flex-col items-center justify-center bg-slate-100 dark:bg-white/10 px-2 py-1 rounded-md border border-slate-200 dark:border-white/5 min-w-[40px]">
              <span className="text-[8px] text-slate-500 dark:text-slate-400 font-bold uppercase leading-none">CTRL</span>
              <span className="text-[10px] text-black dark:text-white font-black leading-none mt-0.5">K</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          
          <button 
            onClick={toggleDarkMode} 
            className="p-3 rounded-full hover:bg-black hover:text-white dark:hover:bg-[#00d1ff] dark:hover:text-black text-slate-500 dark:text-slate-400 transition-all duration-500 border border-transparent hover:border-black dark:hover:border-white/10"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative">
            <button className="p-3 rounded-full hover:bg-black hover:text-white dark:hover:bg-[#00d1ff] dark:hover:text-black text-slate-500 dark:text-slate-400 transition-all duration-500 relative border border-transparent hover:border-black dark:hover:border-white/10">
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-3 right-3 w-2 h-2 bg-brand-rose rounded-full border-2 border-white dark:border-[#020617] animate-pulse" />
              )}
            </button>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2 hidden sm:block" />

          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 p-1 rounded-full transition-all duration-500 group"
              >
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-black leading-none text-black dark:text-white">{user?.name}</p>
                  <p className="text-[10px] opacity-60 font-black mt-1 uppercase tracking-wider text-slate-500 dark:text-slate-400">{user?.role.replace('_', ' ')}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-72 bg-white dark:bg-[#0f172a] border-2 border-black dark:border-white/10 rounded-[32px] shadow-2xl z-20 p-3 overflow-hidden"
                    >
                      <div className="p-5 border-b-2 border-black/5 dark:border-white/5 mb-2 bg-slate-50 dark:bg-white/5 rounded-[24px]">
                        <p className="text-sm font-black text-black dark:text-white truncate">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-3">
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
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-[20px] transition-all duration-300"
                          >
                            {item.icon} {item.label}
                          </button>
                        )))}
                      </div>
                      
                      <div className="h-px bg-slate-100 dark:bg-white/5 my-2 mx-4" />
                      
                      <button 
                        onClick={() => { logout(); navigate('/'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-[20px] transition-all duration-300 font-black"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-black dark:text-white hover:bg-black/5 rounded-full font-black uppercase tracking-widest text-[10px]">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" className="rounded-full shadow-glow-white dark:shadow-glow-cyan font-black uppercase tracking-widest text-[10px]">
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}
