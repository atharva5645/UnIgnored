import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function HeroSection() {
  const { user, isAuthenticated } = useAuthStore()

  const isStaff = user?.role === 'super_admin' || user?.role === 'zonal_admin' || user?.role === 'officer'
  const dashboardLink = user?.role === 'officer' ? '/dashboard/officer' : 
                        (user?.role === 'super_admin' || user?.role === 'zonal_admin') ? '/dashboard/admin' : 
                        '/dashboard/citizen'

  return (
    <section className="relative min-h-[720px] bg-[#ece9ff] overflow-hidden pt-20">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      {/* Purple Overlay */}
      <div className="absolute inset-0 bg-[#ebe7ff]/90" />

      {/* Decorative Shapes */}
      <div className="absolute left-0 top-0 h-full w-[120px] bg-white/10 backdrop-blur-sm" />
      <div className="absolute right-0 top-0 h-full w-[120px] bg-white/10 backdrop-blur-sm" />

      {/* Main Content */}
      <div className="relative z-10 max-w-[1450px] mx-auto px-8 lg:px-14 xl:px-20 min-h-[720px] flex items-center justify-between gap-16">
        {/* Left Content */}
        <div className="max-w-[620px] pt-4">
          <p className="text-[#6f42ff] font-extrabold tracking-[2px] uppercase text-[17px] mb-7">
            24/7 Civic Monitoring Available
          </p>

          <h1 className="text-[72px] xl:text-[84px] leading-[1.02] font-extrabold text-slate-900 dark:text-slate-900 mb-8 tracking-[-3px]">
            Professional
            <br />
            Civic Dashboard.
          </h1>

          <p className="text-slate-800 text-[21px] leading-[38px] mb-14 font-medium max-w-[680px]">
            From complaint tracking to real-time civic issue monitoring,
            UnIgnored helps citizens report, monitor, and resolve public
            problems faster with complete transparency.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-5 pt-2">
            {!isAuthenticated ? (
              <Link to="/login">
                <button className="bg-[#6f42ff] hover:bg-[#5d35e2] transition-all duration-300 text-white font-bold uppercase tracking-[1px] px-10 py-5 rounded-sm text-[16px] shadow-[0_20px_60px_rgba(111,66,255,0.35)]">
                  ⚡ REPORT AN ISSUE
                </button>
              </Link>
            ) : isStaff ? (
              <Link to={dashboardLink}>
                <button className="bg-[#6f42ff] hover:bg-[#5d35e2] transition-all duration-300 text-white font-bold uppercase tracking-[1px] px-10 py-5 rounded-sm text-[16px] shadow-[0_20px_60px_rgba(111,66,255,0.35)]">
                  ⚡ COMMAND CENTER
                </button>
              </Link>
            ) : (
              <Link to="/complaints/new">
                <button className="bg-[#6f42ff] hover:bg-[#5d35e2] transition-all duration-300 text-white font-bold uppercase tracking-[1px] px-10 py-5 rounded-sm text-[16px] shadow-[0_20px_60px_rgba(111,66,255,0.35)]">
                  ⚡ REPORT AN ISSUE
                </button>
              </Link>
            )}

            <button className="border border-slate-900/20 text-slate-900 px-10 py-5 text-[16px] font-semibold backdrop-blur-md bg-white/30 hover:bg-white/50 transition-all duration-300 rounded-sm">
              📞 (555) 123-4567
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative flex items-center justify-center pr-6 hidden lg:flex">
          {/* Curved Shape */}
          <div className="absolute -top-12 -left-10 w-[100px] h-[100px] bg-[#ece9ff] rounded-full z-20" />

          <div className="relative w-[540px] xl:w-[580px] h-[640px] overflow-hidden rounded-tl-[280px] rounded-tr-[280px] shadow-[0_40px_80px_rgba(0,0,0,0.18)]">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1974&auto=format&fit=crop"
              alt="dashboard"
              className="w-full h-full object-cover scale-[1.02]"
            />
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 hidden sm:flex">
        <Link to="/analytics">
          <button className="bg-[#316bff] text-white px-7 py-4 text-[16px] font-bold shadow-xl rounded-sm hover:bg-[#255cff] transition-all duration-300 w-full text-left">
            ⚡ Live Reports
          </button>
        </Link>
        <button className="bg-white text-black px-7 py-4 text-[16px] font-semibold shadow-xl rounded-sm hover:bg-gray-100 transition-all duration-300 text-left">
          👁 Customize
        </button>
      </div>
    </section>
  )
}
