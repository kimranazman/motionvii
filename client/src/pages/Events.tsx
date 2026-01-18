import { useState } from 'react';
import { Calendar as CalendarIcon, List, Grid } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { EventCalendar } from '@/components/events/EventCalendar';
import { EventList } from '@/components/events/EventList';
import { EventModal } from '@/components/events/EventModal';
import { EventFilters } from '@/components/events/EventFilters';
import { useEvents } from '@/hooks/useEvents';
import { useAppStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

type ViewMode = 'calendar' | 'list';

export function Events() {
  const { eventFilters } = useAppStore();
  const { data: events, isLoading } = useEvents(eventFilters);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  const totalBudget = events?.reduce((sum, e) => sum + e.estimatedCost, 0) || 0;

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
        title="Events"
        subtitle={`${events?.length || 0} events • ${formatCurrency(totalBudget)} total budget`}
      />

      {/* View Toggle & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <EventFilters />

        <div className="flex items-center gap-2 p-1 glass rounded-lg">
          <button
            onClick={() => setViewMode('calendar')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
              viewMode === 'calendar'
                ? 'bg-primary/20 text-primary'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            <CalendarIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Calendar</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md transition-colors',
              viewMode === 'list'
                ? 'bg-primary/20 text-primary'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'calendar' ? (
        <EventCalendar events={events || []} />
      ) : (
        <EventList events={events || []} />
      )}

      <EventModal />
    </>
  );
}
