import { useState, useMemo } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Header } from '@/components/layout/Header';
import { KanbanBoard } from '@/components/initiatives/KanbanBoard';
import { InitiativeCard } from '@/components/initiatives/InitiativeCard';
import { InitiativeModal } from '@/components/initiatives/InitiativeModal';
import { FilterBar } from '@/components/initiatives/FilterBar';
import { useInitiatives, useUpdateInitiativeStatus } from '@/hooks/useInitiatives';
import { useAppStore } from '@/store';
import { Initiative, InitiativeStatus } from '@/types';

const COLUMNS: InitiativeStatus[] = [
  'Not Started',
  'In Progress',
  'On Hold',
  'At Risk',
  'Completed',
];

export function Initiatives() {
  const { initiativeFilters } = useAppStore();
  const { data: initiatives, isLoading } = useInitiatives(initiativeFilters);
  const updateStatus = useUpdateInitiativeStatus();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columnData = useMemo(() => {
    if (!initiatives) return {};

    const columns: Record<InitiativeStatus, Initiative[]> = {
      'Not Started': [],
      'In Progress': [],
      'On Hold': [],
      'At Risk': [],
      'Completed': [],
    };

    initiatives.forEach((initiative) => {
      if (columns[initiative.status]) {
        columns[initiative.status].push(initiative);
      }
    });

    return columns;
  }, [initiatives]);

  const activeInitiative = useMemo(() => {
    if (!activeId || !initiatives) return null;
    return initiatives.find((i) => i.id === activeId) || null;
  }, [activeId, initiatives]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const initiativeId = active.id as string;
    const newStatus = over.id as InitiativeStatus;

    // Check if dropping on a valid column
    if (!COLUMNS.includes(newStatus)) return;

    // Find the initiative and check if status actually changed
    const initiative = initiatives?.find((i) => i.id === initiativeId);
    if (!initiative || initiative.status === newStatus) return;

    // Update the status
    updateStatus.mutate({ id: initiativeId, status: newStatus });
  };

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
        title="Initiatives"
        subtitle="Manage and track your strategic initiatives"
      />

      <FilterBar />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <KanbanBoard columns={COLUMNS} data={columnData} />

        <DragOverlay>
          {activeInitiative ? (
            <InitiativeCard initiative={activeInitiative} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      <InitiativeModal />
    </>
  );
}
