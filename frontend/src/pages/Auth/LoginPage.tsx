import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { UserRole } from '../../types/user'
import { Button, Card, Badge } from '../../components/ui'
import { ChevronLeft, Mail, Phone, Lock, ArrowRight, ShieldCheck, Github, Smartphone } from 'lucide-react'
import { clsx } from 'clsx'

const ROLES: { id: UserRole; label: string; icon: string; desc: string }[] = [
  { id: 'citizen', label: 'Citizen', icon: '👤', desc: 'File & track public issues' },
  { id: 'officer', label: 'Field Officer', icon: '👮', desc: 'Manage assigned tasks' },
  { id: 'zonal_admin', label: 'Zonal Admin', icon: '🏛️', desc: 'Oversee ward operations' },
  { id: 'super_admin', label: 'Super Admin', icon: '⚙️', desc: 'Full system control' },
]

export default function LoginPage() {
  const [step, setStep] = useState<'role' | 'credentials' | 'otp'>('role')
  const [role, setRole] = useState<UserRole>('citizen')
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const { login, sendOTP, verifyOTP, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSendOTP = async () => {
    if (!emailOrPhone) return setError('Please enter your email or phone')
    setError('')
    await sendOTP(emailOrPhone)
    setStep('otp')
  }

  const handleVerifyOTP = async () => {
    const code = otp.join('')
    if (code.length < 6) return setError('Enter the full 6-digit code')
    setError('')
    const ok = await verifyOTP(code)
    if (ok) {
      await login(emailOrPhone, role)
      navigate('/')
    } else {
      setError('Invalid OTP. Please use 123456 for demo.')
    }
  }

  const handleOtpChange = (val: string, index: number) => {
    if (val.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = val
    setOtp(newOtp)
    if (val && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-brand-violet flex items-center justify-center text-2xl shadow-glow-blue group-hover:scale-110 transition-transform">👁️</div>
            <span className="font-display font-black text-3xl tracking-tight text-slate-900 dark:text-white">CivicEye</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Log in to track your reports and earn points</p>
        </div>

        <Card className="p-8 shadow-2xl border-slate-200 dark:border-white/10">
          <AnimatePresence mode="wait">
            {step === 'role' && (
              <motion.div 
                key="step-role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-lg font-bold text-white mb-6">Select Your Role</h2>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {ROLES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      className={clsx(
                        'flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 text-left',
                        role === r.id 
                          ? 'bg-primary-500/10 border-primary-500 shadow-glow-blue' 
                          : 'bg-white/5 border-white/5 hover:border-white/20'
                      )}
                    >
                      <span className="text-3xl mb-3">{r.icon}</span>
                      <span className={clsx('text-sm font-black', role === r.id ? 'text-primary-600 dark:text-primary-400' : 'text-slate-900 dark:text-white')}>{r.label}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 mt-2 font-bold uppercase tracking-[0.2em] text-center">{r.desc}</span>
                    </button>
                  ))}
                </div>
                <Button className="w-full" size="lg" onClick={() => setStep('credentials')}>
                  Continue as {ROLES.find(r => r.id === role)?.label} <ArrowRight size={18} className="ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 'credentials' && (
              <motion.div 
                key="step-creds"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button 
                  onClick={() => setStep('role')}
                  className="flex items-center gap-2 text-xs text-slate-500 hover:text-white mb-6 transition-colors"
                >
                  <ChevronLeft size={14} /> Back to role selection
                </button>
                <h2 className="text-lg font-bold text-white mb-6">Login with {role.replace('_', ' ')} ID</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Email or Phone</label>
                    <div className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus-within:border-primary-500/50 transition-all">
                      <Mail size={18} className="text-slate-500" />
                      <input 
                        placeholder="yourname@domain.com"
                        value={emailOrPhone}
                        onChange={e => setEmailOrPhone(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="lg" isLoading={isLoading} onClick={handleSendOTP}>
                  Send Verification Code
                </Button>

                <div className="mt-8 flex items-center gap-4 text-slate-700">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Or Continue With</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-white transition-all">
                    <ShieldCheck size={18} className="text-primary-500" /> Gov ID
                  </button>
                  <button className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-white transition-all">
                    <Smartphone size={18} className="text-violet-500" /> DigiLocker
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'otp' && (
              <motion.div 
                key="step-otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button 
                  onClick={() => setStep('credentials')}
                  className="flex items-center gap-2 text-xs text-slate-500 hover:text-white mb-6 transition-colors"
                >
                  <ChevronLeft size={14} /> Change email/phone
                </button>
                <h2 className="text-lg font-bold text-white mb-2">Verify Account</h2>
                <p className="text-sm text-slate-500 mb-8">We've sent a 6-digit code to <span className="text-white">{emailOrPhone}</span></p>
                
                <div className="flex justify-between gap-2 mb-8">
                  {otp.map((digit, i) => (
                    <input 
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      value={digit}
                      onChange={e => {
                        const val = e.target.value.slice(-1);
                        if (val && !/^\d+$/.test(val)) return;
                        
                        const newOtp = [...otp];
                        newOtp[i] = val;
                        setOtp(newOtp);
                        
                        if (val && i < 5) {
                          document.getElementById(`otp-${i + 1}`)?.focus();
                        }
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                          document.getElementById(`otp-${i - 1}`)?.focus();
                        }
                      }}
                      className="w-12 h-14 bg-white dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 rounded-xl text-center text-xl font-bold text-slate-900 dark:text-white focus:border-primary-500 outline-none transition-all"
                    />
                  ))}
                </div>

                {error && <p className="text-xs text-brand-rose mb-4 text-center">{error}</p>}

                <Button className="w-full" size="lg" isLoading={isLoading} onClick={handleVerifyOTP}>
                  Verify & Continue
                </Button>

                <p className="mt-8 text-center text-xs text-slate-500">
                  Didn't receive the code? <button className="text-primary-400 hover:underline" onClick={handleSendOTP}>Resend in 30s</button>
                </p>
                
                <div className="mt-6 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10 text-center">
                  <p className="text-[10px] text-primary-400 font-bold uppercase tracking-widest">Demo Testing Mode</p>
                  <p className="text-xs text-slate-500 mt-1">Use OTP: <span className="text-white font-mono">123456</span></p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        <p className="text-center mt-8 text-sm text-slate-600">
          New to CivicEye? <Link to="/register" className="text-primary-500 font-bold hover:underline">Create an account</Link>
        </p>
      </motion.div>
    </div>
  )
}
