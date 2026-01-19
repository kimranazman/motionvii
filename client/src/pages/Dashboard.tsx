import { Target, Kanban, Calendar, Users, DollarSign } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/dashboard/KPICard';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { DepartmentChart } from '@/components/dashboard/DepartmentChart';
import { SkeletonKPI, SkeletonChart } from '@/components/ui/Skeleton';
import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/utils';

export function Dashboard() {
  const { data: stats, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <>
        <Header
          title="Dashboard"
          subtitle="Strategic Annual Action Plan 2026 Overview"
        />
        {/* KPI Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SkeletonKPI />
          <SkeletonKPI />
          <SkeletonKPI />
          <SkeletonKPI />
        </div>
        {/* Chart Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <SkeletonChart />
          </div>
          <SkeletonChart />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-text-muted">Failed to load dashboard data</p>
      </div>
    );
  }

  const completedPercentage = Math.round(
    (stats.initiativesByStatus['Completed'] / Math.max(stats.totalInitiatives, 1)) * 100
  );

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Strategic Annual Action Plan 2026 Overview"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="animate-fade-in-up stagger-1 opacity-0">
          <KPICard
            title="Revenue Target"
            value={formatCurrency(stats.revenueTarget)}
            subtitle="Annual Goal"
            icon={Target}
            variant="primary"
          />
        </div>
        <div className="animate-fade-in-up stagger-2 opacity-0">
          <KPICard
            title="Total Initiatives"
            value={stats.totalInitiatives}
            subtitle={`${completedPercentage}% completed`}
            icon={Kanban}
            variant="default"
          />
        </div>
        <div className="animate-fade-in-up stagger-3 opacity-0">
          <KPICard
            title="Total Events"
            value={stats.totalEvents}
            subtitle={formatCurrency(stats.totalEventsCost) + ' budget'}
            icon={Calendar}
            variant="success"
          />
        </div>
        <div className="animate-fade-in-up stagger-4 opacity-0">
          <KPICard
            title="Team Members"
            value={stats.teamMembers.length}
            subtitle="Active contributors"
            icon={Users}
            variant="warning"
          />
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart
            target={stats.revenueTarget}
            current={stats.revenueProgress}
          />
        </div>
        <StatusChart data={stats.initiativesByStatus} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentChart data={stats.departmentWorkload} />

        {/* Team Members Card */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Team Members
          </h3>
          <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {stats.teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
              >
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-medium">
                  {member.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-text-secondary truncate">
                  {member}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 glass rounded-xl p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Status Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Object.entries(stats.initiativesByStatus).map(([status, count]) => (
            <div
              key={status}
              className="text-center p-4 rounded-lg bg-surface"
            >
              <p className="text-2xl font-bold text-text-primary">{count}</p>
              <p className="text-xs text-text-muted mt-1">{status}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
