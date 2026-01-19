import { MapPin, DollarSign, Calendar, CalendarX2 } from 'lucide-react';
import type { Event } from '@/types';
import { useAppStore } from '@/store';
import { formatCurrency, cn } from '@/lib/utils';

interface EventListProps {
  events: Event[];
}

const CATEGORY_CONFIG: Record<string, { bg: string; border: string }> = {
  'Conference': { bg: 'bg-event-conference', border: 'border-l-event-conference' },
  'Exhibition': { bg: 'bg-event-exhibition', border: 'border-l-event-exhibition' },
  'Training': { bg: 'bg-event-training', border: 'border-l-event-training' },
  'Workshop': { bg: 'bg-event-workshop', border: 'border-l-event-workshop' },
  'Networking': { bg: 'bg-event-networking', border: 'border-l-event-networking' },
  'Seminar': { bg: 'bg-purple-500', border: 'border-l-purple-500' },
  'Other': { bg: 'bg-gray-500', border: 'border-l-gray-500' },
};

export function EventList({ events }: EventListProps) {
  const { openEventModal } = useAppStore();

  if (events.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <CalendarX2 className="w-12 h-12 mx-auto text-text-muted/50 mb-3" />
        <p className="text-text-muted">No events found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const categoryConfig = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG['Other'];

        return (
          <div
            key={event.id}
            onClick={() => openEventModal(event)}
            className={cn(
              'glass rounded-xl overflow-hidden cursor-pointer',
              'border-l-4 transition-all duration-200',
              'hover:translate-y-[-2px] hover:border-border-hover',
              'hover:shadow-[0_4px_12px_rgba(0,0,0,0.4),0_0_20px_rgba(0,212,255,0.1)]',
              'group animate-fade-in-up opacity-0',
              categoryConfig.border
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Event Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={cn(
                        'px-2.5 py-1 text-xs font-medium rounded-full text-white',
                        categoryConfig.bg
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

                  <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
                    {event.eventName}
                  </h3>

                  <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                    {event.dateMonth && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary/70" />
                        <span>{event.dateMonth}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-accent/70" />
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

                {/* Cost Pill */}
                <div className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl',
                  'bg-gradient-to-br from-surface to-surface/50',
                  'border border-border/50'
                )}>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Est. Cost</p>
                    <p className="text-lg font-semibold text-text-primary">
                      {formatCurrency(event.estimatedCost)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
