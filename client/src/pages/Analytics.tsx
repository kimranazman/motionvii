import { Header } from '@/components/layout/Header';
import { TimelineChart } from '@/components/analytics/TimelineChart';
import { EventsHeatmap } from '@/components/analytics/EventsHeatmap';
import { CategoryBreakdown } from '@/components/analytics/CategoryBreakdown';
import { ProgressSummary } from '@/components/analytics/ProgressSummary';
import { useDashboard } from '@/hooks/useDashboard';
import { useInitiatives } from '@/hooks/useInitiatives';
import { useEvents } from '@/hooks/useEvents';

export function Analytics() {
  const { data: stats, isLoading: statsLoading } = useDashboard();
  const { data: initiatives, isLoading: initLoading } = useInitiatives();
  const { data: events, isLoading: eventsLoading } = useEvents();

  const isLoading = statsLoading || initLoading || eventsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Header
        title="Analytics"
        subtitle="Insights and performance metrics"
      />

      {/* Progress Summary */}
      <ProgressSummary stats={stats!} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <TimelineChart initiatives={initiatives || []} />
        <EventsHeatmap events={events || []} />
      </div>

      {/* Category Breakdown */}
      <div className="mt-6">
        <CategoryBreakdown events={events || []} />
      </div>
    </>
  );
}
