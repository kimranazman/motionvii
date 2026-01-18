import { X, MapPin, DollarSign, Calendar, Target, Users, FileText } from 'lucide-react';
import { useAppStore } from '@/store';
import { formatCurrency, cn } from '@/lib/utils';

const CATEGORY_COLORS: Record<string, string> = {
  'Conference': 'bg-event-conference',
  'Exhibition': 'bg-event-exhibition',
  'Training': 'bg-event-training',
  'Workshop': 'bg-event-workshop',
  'Networking': 'bg-event-networking',
  'Seminar': 'bg-purple-500',
  'Other': 'bg-gray-500',
};

export function EventModal() {
  const { selectedEvent, isEventModalOpen, closeEventModal } = useAppStore();

  if (!isEventModalOpen || !selectedEvent) return null;

  const event = selectedEvent;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={closeEventModal}
      />

      {/* Modal */}
      <div className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[90vh] z-50 overflow-hidden">
        <div className="glass rounded-xl h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div className="flex-1 pr-4">
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
              <h2 className="text-xl font-semibold text-text-primary">
                {event.eventName}
              </h2>
            </div>
            <button
              onClick={closeEventModal}
              className="p-2 rounded-lg hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Key Details */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-surface">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-text-muted">Date</p>
                  <p className="text-text-primary">{event.dateMonth || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-surface">
                <MapPin className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-text-muted">Location</p>
                  <p className="text-text-primary">{event.location || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg bg-surface">
                <DollarSign className="w-5 h-5 text-status-on-hold" />
                <div>
                  <p className="text-xs text-text-muted">Est. Cost</p>
                  <p className="text-text-primary font-semibold">
                    {formatCurrency(event.estimatedCost)}
                  </p>
                </div>
              </div>
            </div>

            {/* Why Attend */}
            {event.whyAttend && (
              <div className="p-4 rounded-lg bg-surface">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium text-text-muted">
                    Why Attend
                  </h3>
                </div>
                <p className="text-text-secondary">{event.whyAttend}</p>
              </div>
            )}

            {/* Target Companies */}
            {event.targetCompanies && (
              <div className="p-4 rounded-lg bg-surface">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-medium text-text-muted">
                    Target Companies
                  </h3>
                </div>
                <p className="text-text-secondary">{event.targetCompanies}</p>
              </div>
            )}

            {/* Action Required */}
            {event.actionRequired && (
              <div className="p-4 rounded-lg bg-surface border border-primary/30">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium text-text-muted">
                    Action Required
                  </h3>
                </div>
                <p className="text-text-secondary">{event.actionRequired}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
