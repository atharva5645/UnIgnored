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
      primary: 'bg-primary-500 text-white hover:bg-primary-600 ring-2 ring-primary-500/20 hover:ring-primary-500/40',
      secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 border border-slate-300 dark:border-white/10',
      outline: 'border-2 border-slate-200 text-slate-900 hover:bg-slate-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10',
      ghost: 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5',
      danger: 'bg-brand-rose text-white hover:bg-rose-600 ring-2 ring-rose-500/20',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg font-bold',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative inline-flex items-center justify-center gap-2 rounded-none font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
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
      'glass rounded-none p-6 overflow-hidden relative transition-all duration-500',
      className
    )}
  >
    {children}
  </motion.div>
);

// --- Badge ---
export const Badge = ({ children, variant = 'default', className }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'error' | 'info'; className?: string }) => {
  const styles = {
    default: 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white',
    success: 'bg-brand-emerald/20 text-brand-emerald',
    warning: 'bg-brand-amber/20 text-brand-amber',
    error: 'bg-brand-rose/20 text-brand-rose',
    info: 'bg-primary-500/20 text-primary-500 dark:text-primary-400',
  };
  return (
    <span className={cn('px-3 py-1 rounded-none text-[10px] font-bold uppercase tracking-wider', styles[variant], className)}>
      {children}
    </span>
  );
};

// --- Avatar ---
export const Avatar = ({ src, name, size = 'md', className }: { src?: string; name: string; size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-16 h-16 text-xl' };
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
  
  return (
    <div className={cn('rounded-none overflow-hidden bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold shadow-premium', sizes[size], className)}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : initials}
    </div>
  );
};

// --- Stat Card ---
export const StatCard = ({ label, value, icon, trend, color }: { label: string; value: string | number; icon: string; trend?: number; color?: string }) => (
  <Card className={cn('flex flex-col gap-1 border border-slate-200 dark:border-none bg-white dark:bg-dark-900', color)}>
    <div className="flex justify-between items-start">
      <span className="text-3xl filter grayscale-[0.2]">{icon}</span>
      {trend !== undefined && (
        <span className={cn('text-[10px] font-black px-2 py-1 rounded-none', trend >= 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400')}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="mt-4">
      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 dark:text-white font-display mt-1">{value}</h3>
    </div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16" />
  </Card>
);

// --- ProgressBar ---
export const ProgressBar = ({ value, max = 100, color = 'bg-primary-500', showLabel }: { value: number; max?: number; color?: string; showLabel?: boolean }) => {
  const percent = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-[10px] mb-2 font-bold uppercase tracking-widest">
          <span className="text-slate-500">Progress</span>
          <span className="text-slate-900 dark:text-white">{Math.round(percent)}%</span>
        </div>
      )}
      <div className="h-2 bg-slate-100 dark:bg-dark-700 rounded-none overflow-hidden border border-slate-200 dark:border-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'circOut' }}
          className={cn('h-full', color)} 
        />
      </div>
    </div>
  );
};

// --- Skeleton ---
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse bg-slate-200 dark:bg-white/5 rounded-none', className)} />
);
