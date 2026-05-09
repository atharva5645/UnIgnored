import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { UserRole } from '../../types/user'
import { Button, Card, Badge } from '../../components/ui'
import { Mail, Phone, Lock, ShieldCheck, Github, Smartphone, Eye } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { clsx } from 'clsx'
import { signInAnonymously } from 'firebase/auth'
import { auth } from '../../firebase/config'



export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role] = useState<UserRole>('citizen') // Default fallback
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      // Error handled by hook
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    
    // Prototype Bypass for Admins
    if (email === 'admin@gmail.com' && password === '12345678') {
      const prototypeRole: UserRole = 'super_admin'; // Default bypass role
      try {
        // Authenticate anonymously in Firebase so Firestore security rules allow reads
        await signInAnonymously(auth);
      } catch (err) {
        console.error("Anonymous auth failed for prototype:", err);
      }

      useAuthStore.getState().setUser({
        id: 'prototype-admin-id',
        name: prototypeRole === 'super_admin' ? 'Super Admin' : prototypeRole === 'zonal_admin' ? 'Zonal Admin' : 'Field Officer',
        email: 'admin@gmail.com',
        phone: '+91 9876543210',
        role: prototypeRole,
        badges: [],
        rewardPoints: 5000,
        complaintsCount: 0,
        resolvedCount: 150,
        joinedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        isVerified: true,
        aadhaarVerified: true,
        twoFactorEnabled: false,
        privacyMode: true,
        language: 'en',
        theme: 'system',
        fontSize: 'md',
        highContrast: false,
        reducedMotion: false,
        dyslexicFont: false,
        notifications: { push: true, email: true, sms: false, whatsapp: false },
        addresses: [],
        familyAccounts: [],
        isAnonymousCapable: true,
        loginHistory: []
      });
      const dashboard = prototypeRole === 'officer' ? '/dashboard/officer' : 
                        (prototypeRole === 'super_admin' || prototypeRole === 'zonal_admin') ? '/dashboard/admin' : 
                        '/dashboard/citizen'
      navigate(dashboard);
      return;
    }

    try {
      await login(email, password)
      const loggedInUser = useAuthStore.getState().user;
      const userRole = loggedInUser?.role || role;

      const dashboard = userRole === 'officer' ? '/dashboard/officer' : 
                        (userRole === 'super_admin' || userRole === 'zonal_admin') ? '/dashboard/admin' : 
                        '/dashboard/citizen'
      
      navigate(dashboard)
    } catch (err) {
      // Error is handled by the hook and displayed in the UI
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-4 mb-8 group">
            <div className="w-14 h-14 rounded-[20px] bg-black dark:bg-[#00d1ff] flex items-center justify-center shadow-glow-blue group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Eye className="w-8 h-8 text-white dark:text-black" />
            </div>
            <span className="font-display font-black text-4xl tracking-tighter text-slate-900 dark:text-white uppercase">UnIgnored</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Log in to track your reports and earn points</p>
        </div>

        <Card className="p-8 shadow-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
          <div className="space-y-6">

                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Login to your account</h2>
                
                {error && (
                  <div className="mb-6 p-3 rounded-none bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                    <div className="flex items-center gap-3 w-full px-4 py-3 rounded-none bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus-within:border-primary-500/50 transition-all">
                      <Mail size={18} className="text-slate-500" />
                      <input 
                        type="email"
                        placeholder="yourname@domain.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white w-full placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Password</label>
                    <div className="flex items-center gap-3 w-full px-4 py-3 rounded-none bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus-within:border-primary-500/50 transition-all">
                      <Lock size={18} className="text-slate-500" />
                      <input 
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white w-full placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs text-brand-rose px-1">{error}</p>}

                  <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                    Sign In
                  </Button>
                </form>

                  <button 
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-none bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-sm text-slate-900 dark:text-white transition-all w-full mb-4"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-4 text-slate-300 dark:text-slate-700">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Other Methods</span>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 px-4 py-3 rounded-none bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-sm text-slate-900 dark:text-white transition-all">
                      <ShieldCheck size={18} className="text-primary-500" /> Gov ID
                    </button>
                    <button className="flex items-center justify-center gap-3 px-4 py-3 rounded-none bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-sm text-slate-900 dark:text-white transition-all">
                      <Smartphone size={18} className="text-violet-500" /> DigiLocker
                    </button>
                  </div>
          </div>
        </Card>

        <p className="text-center mt-8 text-sm text-slate-600">
          New to UnIgnored? <Link to="/register" className="text-primary-500 font-bold hover:underline">Create an account</Link>
        </p>
      </motion.div>
    </div>
  )
}
