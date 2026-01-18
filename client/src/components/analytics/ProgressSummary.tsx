import { TrendingUp, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import type { DashboardStats } from '@/types';
import { formatCurrency, calculateProgress } from '@/lib/utils';

interface ProgressSummaryProps {
  stats: DashboardStats;
}

export function ProgressSummary({ stats }: ProgressSummaryProps) {
  const completionRate = calculateProgress(
    stats.initiativesByStatus['Completed'],
    stats.totalInitiatives
  );

  const atRiskCount = stats.initiativesByStatus['At Risk'];
  const inProgressCount = stats.initiativesByStatus['In Progress'];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Revenue Progress */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-text-primary">Revenue Progress</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-text-primary">
              {formatCurrency(stats.revenueProgress)}
            </span>
            <span className="text-sm text-text-muted">
              / {formatCurrency(stats.revenueTarget)}
            </span>
          </div>
          <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{
                width: `${calculateProgress(stats.revenueProgress, stats.revenueTarget)}%`,
              }}
            />
          </div>
          <p className="text-xs text-text-muted">
            {calculateProgress(stats.revenueProgress, stats.revenueTarget)}% of
            annual target
          </p>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/10">
            <CheckCircle className="w-5 h-5 text-accent" />
          </div>
          <h3 className="font-semibold text-text-primary">Completion Rate</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-text-primary">
              {completionRate}%
            </span>
            <span className="text-sm text-text-muted">
              {stats.initiativesByStatus['Completed']} / {stats.totalInitiatives}
            </span>
          </div>
          <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-xs text-text-muted">initiatives completed</p>
        </div>
      </div>

      {/* In Progress */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-secondary/10">
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          <h3 className="font-semibold text-text-primary">In Progress</h3>
        </div>
        <div className="space-y-2">
          <span className="text-2xl font-bold text-text-primary">
            {inProgressCount}
          </span>
          <p className="text-sm text-text-secondary">
            Active initiatives being worked on
          </p>
        </div>
      </div>

      {/* At Risk */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-status-at-risk/10">
            <AlertTriangle className="w-5 h-5 text-status-at-risk" />
          </div>
          <h3 className="font-semibold text-text-primary">At Risk</h3>
        </div>
        <div className="space-y-2">
          <span className="text-2xl font-bold text-text-primary">
            {atRiskCount}
          </span>
          <p className="text-sm text-text-secondary">
            Initiatives needing attention
          </p>
        </div>
      </div>
    </div>
  );
}
