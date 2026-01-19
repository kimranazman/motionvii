import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning';
}

const variantStyles = {
  default: {
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
    accentColor: 'from-slate-400 to-slate-300',
  },
  primary: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    accentColor: 'from-primary to-secondary',
  },
  success: {
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    accentColor: 'from-accent to-accent/60',
  },
  warning: {
    iconBg: 'bg-status-on-hold/10',
    iconColor: 'text-status-on-hold',
    accentColor: 'from-status-on-hold to-status-on-hold/60',
  },
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: KPICardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        'bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300',
        'hover:shadow-md hover:-translate-y-0.5'
      )}
    >
      {/* Gradient accent line at top */}
      <div className={cn('h-1 bg-gradient-to-r', styles.accentColor)} />

      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-text-muted mb-1">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-text-primary">
              {value}
            </p>
            {subtitle && (
              <p className="text-sm text-text-secondary mt-1">{subtitle}</p>
            )}
            {trend && (
              <div
                className={cn(
                  'inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium',
                  trend.isPositive
                    ? 'bg-accent/10 text-accent'
                    : 'bg-status-at-risk/10 text-status-at-risk'
                )}
              >
                <span>{trend.isPositive ? '↑' : '↓'}</span>
                <span>{Math.abs(trend.value)}%</span>
                <span className="text-text-muted ml-1">vs last month</span>
              </div>
            )}
          </div>
          <div
            className={cn(
              'p-3 rounded-xl transition-transform duration-300',
              'group-hover:scale-110',
              styles.iconBg
            )}
          >
            <Icon className={cn('w-6 h-6', styles.iconColor)} />
          </div>
        </div>
      </div>
    </div>
  );
}
