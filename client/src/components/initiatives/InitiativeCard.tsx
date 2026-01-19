import { User, Calendar, Building2, Flag } from 'lucide-react';
import type { Initiative, InitiativeStatus } from '@/types';
import { cn, truncateText, formatDate } from '@/lib/utils';
import { useAppStore } from '@/store';

interface InitiativeCardProps {
  initiative: Initiative;
}

const STATUS_BORDER_COLORS: Record<InitiativeStatus, string> = {
  'Not Started': 'border-l-status-not-started',
  'In Progress': 'border-l-status-in-progress',
  'On Hold': 'border-l-status-on-hold',
  'At Risk': 'border-l-status-at-risk',
  'Completed': 'border-l-status-completed',
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  'Objective 1': { label: 'High', color: 'bg-status-at-risk/10 text-status-at-risk' },
  'Objective 2': { label: 'Medium', color: 'bg-status-on-hold/10 text-status-on-hold' },
  'Objective 3': { label: 'Normal', color: 'bg-status-in-progress/10 text-status-in-progress' },
};

export function InitiativeCard({ initiative }: InitiativeCardProps) {
  const { openInitiativeModal } = useAppStore();

  const handleClick = () => {
    openInitiativeModal(initiative);
  };

  const priority = initiative.objective ? PRIORITY_CONFIG[initiative.objective] : null;

  return (
    <div
      className={cn(
        'group relative rounded-lg bg-surface border border-border cursor-pointer',
        'border-l-4 overflow-hidden',
        'transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-md hover:border-border-hover',
        STATUS_BORDER_COLORS[initiative.status]
      )}
      onClick={handleClick}
    >
      <div className="relative p-4">
        {/* Header with priority badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-medium text-text-primary flex-1">
            {truncateText(initiative.initiative, 60)}
          </h4>
          {priority && (
            <span className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium shrink-0',
              priority.color
            )}>
              <Flag className="w-2.5 h-2.5" />
              {priority.label}
            </span>
          )}
        </div>

        {/* Key Result */}
        {initiative.keyResult && (
          <p className="text-sm text-text-secondary mb-3">
            {truncateText(initiative.keyResult, 80)}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 text-xs">
          {/* Department */}
          {initiative.department && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-bg-secondary text-text-muted">
              <Building2 className="w-3 h-3" />
              <span>{initiative.department}</span>
            </div>
          )}

          {/* Person in Charge */}
          {initiative.personInCharge && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-bg-secondary text-text-muted">
              <User className="w-3 h-3" />
              <span>{truncateText(initiative.personInCharge, 15)}</span>
            </div>
          )}

          {/* Due Date */}
          {initiative.endDate && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-bg-secondary text-text-muted">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(initiative.endDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
