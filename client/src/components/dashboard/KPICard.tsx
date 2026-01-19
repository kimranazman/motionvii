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
    iconBg: 'bg-surface',
    iconColor: 'text-text-secondary',
    accentColor: 'from-text-secondary/50 to-text-secondary/20',
    glowColor: 'hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)]',
  },
  primary: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    accentColor: 'from-primary to-secondary',
    glowColor: 'hover:shadow-[0_4px_20px_rgba(0,212,255,0.25)]',
  },
  success: {
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    accentColor: 'from-accent to-accent/50',
    glowColor: 'hover:shadow-[0_4px_20px_rgba(0,255,136,0.25)]',
  },
  warning: {
    iconBg: 'bg-status-on-hold/10',
    iconColor: 'text-status-on-hold',
    accentColor: 'from-status-on-hold to-status-on-hold/50',
    glowColor: 'hover:shadow-[0_4px_20px_rgba(245,158,11,0.25)]',
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
        'glass rounded-xl overflow-hidden transition-all duration-300',
        'hover:scale-[1.02] hover:border-border-hover',
        styles.glowColor
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
