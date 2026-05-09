import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { UserRole } from '../../types/user'
import { Button, Card } from '../../components/ui'
import { User, Mail, Phone, Lock, MapPin, ArrowRight, ShieldCheck, CheckCircle2, Eye } from 'lucide-react'
import { clsx } from 'clsx'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<UserRole>('citizen')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    aadhaar: ''
  })
  const { register, loginWithGoogle, isLoading, error, clearError } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (step > 2) setStep(2)
  }, [step])

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      // Error handled by hook
    }
  }

  const handleNext = () => {
    clearError()
    setStep(s => s + 1)
  }
  const handleBack = () => {
    clearError()
    setStep(s => s - 1)
  }

  const handleSubmit = async () => {
    try {
      await register(formData.email, formData.password, formData.name, role)
      navigate('/')
    } catch (err) {
      // Error handled by hook
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-4 mb-8 group">
            <div className="w-14 h-14 rounded-[20px] bg-black dark:bg-[#f59e0b] flex items-center justify-center shadow-glow-amber group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <Eye className="w-8 h-8 text-white dark:text-black" />
            </div>
            <span className="font-display font-black text-4xl tracking-tighter text-slate-900 dark:text-white uppercase">UnIgnored</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Join the Mission</h1>
          <p className="text-slate-500 mt-2">Empowering citizens for a better tomorrow</p>
        </div>

        <Card className="p-8 shadow-2xl border-slate-200 dark:border-white/10 bg-white dark:bg-transparent">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between mb-10">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={clsx(
                  'w-10 h-10 rounded-none flex items-center justify-center text-sm font-bold transition-all duration-300',
                  step >= s ? 'bg-primary-500 text-white shadow-glow-amber' : 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-white/10'
                )}>
                  {step > s ? <CheckCircle2 size={18} /> : s}
                </div>
                {s < 2 && <div className={clsx('flex-1 h-0.5 mx-4 rounded-none', step > s ? 'bg-primary-500' : 'bg-slate-200 dark:bg-white/5')} />}
              </React.Fragment>
            ))}
          </div>

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Choose Your Role</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { id: 'citizen', label: 'Citizen', icon: '👤', desc: 'Report issues' },
                  { id: 'officer', label: 'Officer', icon: '👮', desc: 'Resolve tasks' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id as UserRole)}
                    className={clsx(
                      'p-6 rounded-none border transition-all duration-300 text-left',
                      role === r.id ? 'bg-primary-500/10 border-primary-500' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                    )}
                  >
                    <span className="text-4xl mb-4 block">{r.icon}</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white">{r.label}</span>
                    <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-[0.2em]">{r.desc}</p>
                  </button>
                ))}
              </div>
              <Button className="w-full" size="lg" onClick={handleNext}>
                Continue <ArrowRight size={18} className="ml-2" />
              </Button>

              <div className="mt-8 flex items-center gap-4 text-slate-300 dark:text-slate-700">
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Or Register With</span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
              </div>

              <button 
                onClick={handleGoogleLogin}
                className="mt-6 flex items-center justify-center gap-3 px-4 py-3 rounded-none bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-sm text-slate-900 dark:text-white transition-all w-full"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Create {role.replace('_', ' ')} Account</h2>
              
              {error && (
                <div className="mb-6 p-3 rounded-none bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                  <div className="flex items-center gap-3 w-full px-4 py-3 rounded-none bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <User size={18} className="text-slate-500" />
                    <input 
                      placeholder="John Doe" 
                      className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white w-full"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                  <div className="flex items-center gap-3 w-full px-4 py-3 rounded-none bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <Mail size={18} className="text-slate-500" />
                    <input 
                      placeholder="john@example.com" 
                      className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white w-full"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">Password</label>
                  <div className="flex items-center gap-3 w-full px-4 py-3 rounded-none bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <Lock size={18} className="text-slate-500" />
                    <input 
                      type="password"
                      placeholder="••••••••" 
                      className="bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white w-full"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 px-2 mb-8">
                <input type="checkbox" id="terms" className="mt-1 accent-primary-500" />
                <label htmlFor="terms" className="text-xs text-slate-500 leading-relaxed">
                  I agree to the <Link to="/terms" className="text-primary-500 dark:text-primary-400">Terms of Service</Link> and <Link to="/privacy" className="text-primary-500 dark:text-primary-400">Privacy Policy</Link>. I understand that filing false reports is a punishable offense.
                </label>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={handleBack}>Back</Button>
                <Button className="flex-[2]" glow isLoading={isLoading} onClick={handleSubmit}>Complete Registration</Button>
              </div>
            </motion.div>
          )}
        </Card>

        <p className="text-center mt-8 text-sm text-slate-600">
          Already have an account? <Link to="/login" className="text-primary-500 font-bold hover:underline">Sign in instead</Link>
        </p>
      </motion.div>
    </div>
  )
}

