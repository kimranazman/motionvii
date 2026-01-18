import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Initiative, InitiativeStatus } from '@/types';
import { InitiativeCard } from './InitiativeCard';
import { cn } from '@/lib/utils';

interface KanbanBoardProps {
  columns: InitiativeStatus[];
  data: Record<InitiativeStatus, Initiative[]>;
}

const COLUMN_COLORS: Record<InitiativeStatus, string> = {
  'Not Started': 'border-t-status-not-started',
  'In Progress': 'border-t-status-in-progress',
  'On Hold': 'border-t-status-on-hold',
  'At Risk': 'border-t-status-at-risk',
  'Completed': 'border-t-status-completed',
};

function KanbanColumn({
  status,
  items,
}: {
  status: InitiativeStatus;
  items: Initiative[];
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col min-w-[280px] max-w-[320px] flex-shrink-0',
        'glass rounded-xl border-t-4',
        COLUMN_COLORS[status],
        isOver && 'ring-2 ring-primary/50'
      )}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-text-primary">{status}</h3>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-surface text-text-secondary">
            {items.length}
          </span>
        </div>
      </div>

      {/* Cards Container */}
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-320px)]">
          {items.length === 0 ? (
            <div className="py-8 text-center text-text-muted text-sm">
              No initiatives
            </div>
          ) : (
            items.map((initiative) => (
              <InitiativeCard key={initiative.id} initiative={initiative} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function KanbanBoard({ columns, data }: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          items={data[status] || []}
        />
      ))}
    </div>
  );
}
