import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './common/Navbar'
import { CommandPalette } from './common/CommandPalette'
import { useUIStore } from '../store/uiStore'
import { Toaster } from 'react-hot-toast'
import { clsx } from 'clsx'

export function AppShell() {
  const { darkMode, fontSize, dyslexicFont, rtl, highContrast } = useUIStore()
  const location = useLocation()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={clsx(
      'min-h-screen transition-colors duration-500',
      darkMode ? 'dark bg-[#020617] text-slate-200' : 'bg-slate-50 text-slate-900',
      fontSize === 'lg' ? 'text-lg' : fontSize === 'sm' ? 'text-sm' : 'text-base',
      dyslexicFont && 'font-dyslexic',
      rtl && 'rtl',
      highContrast && 'contrast-125 brightness-110'
    )} style={{ backgroundColor: darkMode ? '#020617' : '#f8fafc' }}>
      {/* Global Components */}
      {!isAuthPage && <Navbar />}
      <CommandPalette />
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'glass border-white/10 text-white',
          duration: 4000,
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        }} 
      />

      {/* Main Page Content */}
      <main className="relative z-0">
        <Outlet />
      </main>
    </div>
  )
}
