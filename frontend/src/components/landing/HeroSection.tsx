import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import { Eye, Shield } from 'lucide-react'

export function HeroSection() {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAuthStore()

  const isStaff = user?.role === 'super_admin' || user?.role === 'zonal_admin' || user?.role === 'officer'
  const dashboardLink = user?.role === 'officer' ? '/dashboard/officer' : 
                        (user?.role === 'super_admin' || user?.role === 'zonal_admin') ? '/dashboard/admin' : 
                        '/dashboard/citizen'

  return (
    <section className="relative min-h-[720px] bg-white dark:bg-slate-950 overflow-hidden pt-20">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-5 grayscale"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/80" />

      {/* Decorative Shapes */}
      <div className="absolute left-0 top-0 h-full w-[120px] bg-slate-100/50 dark:bg-white/5 backdrop-blur-sm" />
      <div className="absolute right-0 top-0 h-full w-[120px] bg-slate-100/50 dark:bg-white/5 backdrop-blur-sm" />

      {/* Main Content */}
      <div className="relative z-10 max-w-[1450px] mx-auto px-8 lg:px-14 xl:px-20 min-h-[720px] flex items-center justify-between gap-16">
        {/* Left Content */}
        <div className="max-w-[620px] pt-4">
          <p className="text-primary-400 font-extrabold tracking-[2px] uppercase text-[15px] mb-7">
            24/7 CIVIC MONITORING AVAILABLE
          </p>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-[#00d1ff] rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,210,255,0.4)] border-2 border-white/20">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-6xl font-black tracking-tight text-slate-900 dark:text-white">
              Professional <br />
              <span className="text-primary-500">Civic Dashboard</span>
            </h1>
          </div>

          <p className="text-slate-700 dark:text-slate-400 text-[18px] leading-[32px] mb-14 font-medium max-w-[580px]">
            From complaint tracking to real-time civic issue monitoring, UnIgnored helps citizens report, monitor, and resolve public problems faster with complete transparency.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-5 pt-2">
            <Link to={isAuthenticated ? dashboardLink : "/login"}>
              <button className="bg-primary-500 hover:bg-primary-400 transition-all duration-300 text-slate-900 font-black uppercase tracking-[1px] px-10 py-5 rounded-xl text-[16px] shadow-2xl">
                ⚡ JOIN WATCH AND STEP
              </button>
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative flex items-center justify-center pr-6 hidden lg:flex">
          <div className="relative w-[540px] xl:w-[580px] h-[640px] overflow-hidden rounded-[48px] shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1974&auto=format&fit=crop"
              alt="dashboard"
              className="w-full h-full object-cover scale-[1.02]"
            />
            
            {/* Overlay Badges positioned relative to image */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3 pr-4">
              <Link to="/analytics">
                <button className="bg-primary-400 text-slate-900 px-6 py-3 text-[14px] font-black shadow-xl rounded-xl hover:bg-primary-300 transition-all duration-300 flex items-center gap-2">
                  <span className="w-2 h-2 bg-slate-900 rounded-full animate-pulse" /> Live Reports
                </button>
              </Link>
              <button className="bg-slate-900 text-white px-6 py-3 text-[14px] font-black shadow-xl rounded-xl hover:bg-slate-800 transition-all duration-300 flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full" /> Customize
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
