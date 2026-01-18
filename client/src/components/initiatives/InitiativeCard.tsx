import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { User, Calendar, Building2, GripVertical } from 'lucide-react';
import type { Initiative } from '@/types';
import { cn, truncateText, formatDate } from '@/lib/utils';
import { useAppStore } from '@/store';

interface InitiativeCardProps {
  initiative: Initiative;
  isDragging?: boolean;
}

export function InitiativeCard({ initiative, isDragging }: InitiativeCardProps) {
  const { openInitiativeModal } = useAppStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: initiative.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't open modal when dragging
    if (isSortableDragging) return;
    openInitiativeModal(initiative);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative p-4 rounded-lg bg-bg-secondary/50 border border-border cursor-pointer transition-all duration-200',
        'hover:border-border-hover hover:bg-surface',
        (isDragging || isSortableDragging) && 'opacity-50 shadow-lg ring-2 ring-primary'
      )}
      onClick={handleClick}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute right-2 top-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-text-muted" />
      </div>

      {/* Initiative Title */}
      <h4 className="font-medium text-text-primary pr-6 mb-2">
        {truncateText(initiative.initiative, 60)}
      </h4>

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
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-surface text-text-muted">
            <Building2 className="w-3 h-3" />
            <span>{initiative.department}</span>
          </div>
        )}

        {/* Person in Charge */}
        {initiative.personInCharge && (
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-surface text-text-muted">
            <User className="w-3 h-3" />
            <span>{truncateText(initiative.personInCharge, 15)}</span>
          </div>
        )}

        {/* Due Date */}
        {initiative.endDate && (
          <div className="flex items-center gap-1 px-2 py-1 rounded bg-surface text-text-muted">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(initiative.endDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
