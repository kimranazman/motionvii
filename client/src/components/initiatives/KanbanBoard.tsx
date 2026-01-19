import { Inbox } from 'lucide-react';
import type { Initiative, InitiativeStatus } from '@/types';
import { InitiativeCard } from './InitiativeCard';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  columns: InitiativeStatus[];
  data: Record<InitiativeStatus, Initiative[]>;
}

const COLUMN_CONFIG: Record<InitiativeStatus, { borderColor: string; gradientFrom: string }> = {
  'Not Started': {
    borderColor: 'border-t-status-not-started',
    gradientFrom: 'from-status-not-started/20'
  },
  'In Progress': {
    borderColor: 'border-t-status-in-progress',
    gradientFrom: 'from-status-in-progress/20'
  },
  'On Hold': {
    borderColor: 'border-t-status-on-hold',
    gradientFrom: 'from-status-on-hold/20'
  },
  'At Risk': {
    borderColor: 'border-t-status-at-risk',
    gradientFrom: 'from-status-at-risk/20'
  },
  'Completed': {
    borderColor: 'border-t-status-completed',
    gradientFrom: 'from-status-completed/20'
  },
};

function KanbanColumn({
  status,
  items,
  columnIndex,
}: {
  status: InitiativeStatus;
  items: Initiative[];
  columnIndex: number;
}) {
  const config = COLUMN_CONFIG[status];

  return (
    <div
      className={cn(
        'flex flex-col min-w-[280px] max-w-[320px] flex-shrink-0',
        'glass rounded-xl border-t-4 overflow-hidden',
        'animate-fade-in-up opacity-0',
        config.borderColor
      )}
      style={{ animationDelay: `${columnIndex * 75}ms` }}
    >
      {/* Column Header with gradient background */}
      <div className={cn(
        'p-4 border-b border-border',
        'bg-gradient-to-b to-transparent',
        config.gradientFrom
      )}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">{status}</h3>
          <span className={cn(
            'px-2.5 py-1 text-xs font-semibold rounded-full',
            'bg-surface/80 text-text-primary backdrop-blur-sm',
            'border border-border/50'
          )}>
            {items.length}
          </span>
        </div>
      </div>

      {/* Cards Container with better scrollbar */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-320px)] scrollbar-thin">
        {items.length === 0 ? (
          <div className="py-12 text-center">
            <Inbox className="w-8 h-8 mx-auto text-text-muted/50 mb-2" />
            <p className="text-text-muted text-sm">No initiatives</p>
          </div>
        ) : (
          items.map((initiative, index) => (
            <div
              key={initiative.id}
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: `${(columnIndex * 75) + (index * 50)}ms` }}
            >
              <InitiativeCard initiative={initiative} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function KanbanBoard({ columns, data }: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((status, index) => (
        <KanbanColumn
          key={status}
          status={status}
          items={data[status] || []}
          columnIndex={index}
        />
      ))}
    </div>
  );
}
