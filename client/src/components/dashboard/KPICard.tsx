import { LucideIcon } from 'lucide-react';
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
    iconBg: 'bg-surface',
    iconColor: 'text-text-secondary',
    glow: '',
  },
  primary: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    glow: 'hover:shadow-[0_0_30px_rgba(0,212,255,0.2)]',
  },
  success: {
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    glow: 'hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]',
  },
  warning: {
    iconBg: 'bg-status-on-hold/10',
    iconColor: 'text-status-on-hold',
    glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
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
        'glass rounded-xl p-6 transition-all duration-300',
        styles.glow
      )}
    >
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
                'flex items-center gap-1 mt-2 text-sm',
                trend.isPositive ? 'text-accent' : 'text-status-at-risk'
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-text-muted">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'p-3 rounded-xl',
            styles.iconBg
          )}
        >
          <Icon className={cn('w-6 h-6', styles.iconColor)} />
        </div>
      </div>
    </div>
  );
}
