import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, HTMLMotionProps } from 'framer-motion';

// Utility for merging tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Button ---
interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  glow?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, glow, leftIcon, rightIcon, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-black text-white hover:bg-slate-900 dark:bg-[#f59e0b] dark:text-black dark:hover:bg-[#fbbf24] shadow-glow-white dark:shadow-glow-amber',
      secondary: 'bg-white text-black hover:bg-slate-100 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 border border-black dark:border-white/10',
      outline: 'border-2 border-black text-black hover:bg-slate-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10',
      ghost: 'text-slate-600 hover:text-black hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5',
      danger: 'bg-brand-rose text-white hover:bg-rose-600 ring-2 ring-rose-500/20',
    };
    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-2.5 text-sm',
      lg: 'px-8 py-3.5 text-base',
      xl: 'px-10 py-5 text-lg font-bold',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded-[32px] font-bold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        {!isLoading && leftIcon}
        {children as React.ReactNode}
        {!isLoading && rightIcon}
      </motion.button>
    );
  }
);

// --- Card ---
export const Card = ({ children, className, hover, onClick }: { children: React.ReactNode; className?: string; hover?: boolean; onClick?: () => void }) => (
  <motion.div
    whileHover={hover ? { y: -5, scale: 1.01 } : {}}
    onClick={onClick}
    className={cn(
      'bg-white dark:bg-[#0f172a] border border-black dark:border-white/5 rounded-[32px] p-6 overflow-hidden relative transition-all duration-500',
      className
    )}
  >
    {children}
  </motion.div>
);

// --- Badge ---
export const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'info'; className?: string }) => {
  const styles = {
    default: 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    error: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400',
    info: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
  };
  return (
    <span className={cn('px-3 py-1 rounded-[32px] text-[10px] font-black uppercase tracking-widest', styles[variant], className)}>
      {children}
    </span>
  );
};

// --- Avatar ---
export const Avatar = ({ src, name, size = 'md', className }: { src?: string; name: string; size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-16 h-16 text-xl' };
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  
  return (
    <div className={cn('rounded-[32px] overflow-hidden bg-black dark:bg-[#f59e0b] flex items-center justify-center text-white dark:text-black font-black shadow-premium border-2 border-white dark:border-[#020617]', sizes[size], className)}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : initials}
    </div>
  );
};

// --- Stat Card ---
export const StatCard = ({ label, value, icon, trend, color }: { label: string; value: string | number; icon: string; trend?: number; color?: string }) => (
  <Card className={cn('flex flex-col gap-1 border border-black dark:border-white/5 bg-white dark:bg-[#0f172a]', color)}>
    <div className="flex justify-between items-start">
      <div className="w-12 h-12 rounded-[20px] bg-slate-50 dark:bg-white/5 flex items-center justify-center text-2xl shadow-inner">
        {icon}
      </div>
      {trend !== undefined && (
        <span className={cn('text-[10px] font-black px-3 py-1 rounded-[32px] border', trend >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400')}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="mt-6">
      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{label}</p>
      <h3 className="text-4xl font-black text-slate-900 dark:text-white font-display mt-1">{value}</h3>
    </div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-black/5 dark:bg-[#f59e0b]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
  </Card>
);

// --- ProgressBar ---
export const ProgressBar = ({ value, max = 100, color = 'bg-black dark:bg-[#f59e0b]', showLabel }: { value: number; max?: number; color?: string; showLabel?: boolean }) => {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest">
          <span className="text-slate-500">Progress</span>
          <span className="text-slate-900 dark:text-white">{Math.round(percent)}%</span>
        </div>
      )}
      <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/5 p-0.5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'circOut' }}
          className={cn('h-full rounded-[32px]', color)} 
        />
      </div>
    </div>
  );
};

// --- Skeleton ---
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse bg-slate-100 dark:bg-white/5 rounded-[32px]', className)} />
);
