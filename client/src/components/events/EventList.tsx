import { MapPin, DollarSign, Calendar, Tag } from 'lucide-react';
import type { Event } from '@/types';
import { useAppStore } from '@/store';
import { formatCurrency, cn } from '@/lib/utils';

interface EventListProps {
  events: Event[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Conference': 'bg-event-conference',
  'Exhibition': 'bg-event-exhibition',
  'Training': 'bg-event-training',
  'Workshop': 'bg-event-workshop',
  'Networking': 'bg-event-networking',
  'Seminar': 'bg-purple-500',
  'Other': 'bg-gray-500',
};

export function EventList({ events }: EventListProps) {
  const { openEventModal } = useAppStore();

  if (events.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-text-muted">No events found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          onClick={() => openEventModal(event)}
          className="glass rounded-xl p-4 sm:p-6 cursor-pointer hover:border-border-hover transition-all duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            {/* Event Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full text-white',
                    CATEGORY_COLORS[event.category] || CATEGORY_COLORS['Other']
                  )}
                >
                  {event.category}
                </span>
                {event.status && (
                  <span className="px-2 py-1 text-xs rounded bg-surface text-text-muted">
                    {event.status}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {event.eventName}
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                {event.dateMonth && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{event.dateMonth}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              {event.whyAttend && (
                <p className="mt-3 text-sm text-text-muted line-clamp-2">
                  {event.whyAttend}
                </p>
              )}
            </div>

            {/* Cost */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-surface">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-text-muted">Est. Cost</p>
                <p className="text-lg font-semibold text-text-primary">
                  {formatCurrency(event.estimatedCost)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
