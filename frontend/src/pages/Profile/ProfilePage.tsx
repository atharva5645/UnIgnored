import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { 
  User, Mail, Phone, MapPin, Shield, 
  Award, TrendingUp, Settings, ChevronRight, 
  Camera, CheckCircle2, History, CreditCard,
  Bell, Globe, LogOut
} from 'lucide-react'
import { Card, Button, Avatar, Badge, StatCard } from '../../components/ui'
import { clsx } from 'clsx'

export default function ProfilePage() {
  const { user, logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'history'>('overview')

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 pt-24 pb-20 px-6 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left: Identity Card */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary-500/20 to-brand-violet/20" />
              <div className="relative z-10 pt-4">
                <div className="relative inline-block group">
                  <Avatar name={user.name} src={user.avatar} size="lg" className="w-24 h-24 mx-auto border-4 border-white dark:border-dark-950 shadow-2xl" />
                  <button className="absolute bottom-0 right-0 p-2 bg-primary-500 text-white rounded-xl shadow-glow-blue opacity-0 group-hover:opacity-100 transition-all">
                    <Camera size={14} />
                  </button>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-6 font-display">{user.name}</h2>
                <p className="text-sm text-slate-500 mt-1">{user.email}</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Badge variant="success">Verified Profile</Badge>
                  <Badge variant="info">Resident</Badge>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-200 dark:border-white/5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Citizen ID</span>
                  <span className="text-slate-900 dark:text-white font-mono text-xs">CE-USR-8821</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Member Since</span>
                  <span className="text-slate-900 dark:text-white">Mar 2024</span>
                </div>
              </div>

              <Button variant="danger" size="sm" className="w-full mt-8" onClick={logout}>
                <LogOut size={16} className="mr-2" /> Sign Out
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                <Award size={16} className="text-amber-400" /> My Badges
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {user.badges.map(b => (
                  <div key={b.id} title={b.name} className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center text-2xl shadow-inner cursor-help hover:scale-110 transition-transform">
                    {b.icon}
                  </div>
                ))}
                <div className="w-12 h-12 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-slate-700">
                  +3
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Tabs and Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-white/5 w-fit">
              {[
                { id: 'overview', label: 'Overview', icon: <TrendingUp size={16} /> },
                { id: 'settings', label: 'Account Settings', icon: <Settings size={16} /> },
                { id: 'history', label: 'Login History', icon: <History size={16} /> },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id as any)}
                  className={clsx(
                    'flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300',
                    activeTab === t.id ? 'bg-primary-500 text-white shadow-glow-blue' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div 
                  key="overview" 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <StatCard label="Reward Points" value={user.rewardPoints} icon="🏅" color="from-amber-500/10 to-orange-500/10" />
                    <StatCard label="Reports Resolved" value={user.resolvedCount} icon="✅" color="from-emerald-500/10 to-green-500/10" />
                  </div>

                  <Card className="p-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Contact Information</h3>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-dark-950 flex items-center justify-center text-primary-500"><Phone size={18} /></div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Mobile Number</p>
                          <p className="text-sm text-slate-900 dark:text-white font-bold">{user.phone}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto text-primary-400">Edit</Button>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-dark-950 flex items-center justify-center text-primary-500"><Mail size={18} /></div>
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Primary Email</p>
                          <p className="text-sm text-slate-900 dark:text-white font-bold">{user.email}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto text-primary-400">Edit</Button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Saved Addresses</h3>
                      <Button variant="outline" size="sm">Add New</Button>
                    </div>
                    <div className="space-y-4">
                      {user.addresses.map((addr, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-dark-950 flex items-center justify-center text-primary-500"><MapPin size={18} /></div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">{addr.label} {addr.isDefault && <Badge variant="info" className="ml-2">Default</Badge>}</p>
                            <p className="text-xs text-slate-500 mt-1">{addr.address}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <Card className="p-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Security Settings</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Two-Factor Authentication</p>
                          <p className="text-xs text-slate-500">Secure your account with a secondary code</p>
                        </div>
                        <button className="w-12 h-6 rounded-full bg-slate-200 dark:bg-dark-700 p-1"><div className="w-4 h-4 bg-white rounded-full" /></button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Anonymous Reporting</p>
                          <p className="text-xs text-slate-500">Keep your name hidden from public complaints by default</p>
                        </div>
                        <button className="w-12 h-6 rounded-full bg-primary-500 p-1"><div className="w-4 h-4 bg-white rounded-full translate-x-6" /></button>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Communication Preferences</h3>
                    <div className="space-y-4">
                      {['Push Notifications', 'Email Updates', 'WhatsApp Alerts', 'SMS Notifications'].map(pref => (
                        <div key={pref} className="flex items-center justify-between py-2">
                          <span className="text-sm text-slate-600 dark:text-slate-300">{pref}</span>
                          <button className="text-xs text-primary-400 font-bold">MANAGE</button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
