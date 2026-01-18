import { useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { KanbanBoard } from '@/components/initiatives/KanbanBoard';
import { InitiativeModal } from '@/components/initiatives/InitiativeModal';
import { FilterBar } from '@/components/initiatives/FilterBar';
import { useInitiatives } from '@/hooks/useInitiatives';
import { useAppStore } from '@/store';
import type { Initiative, InitiativeStatus } from '@/types';

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

  const columnData = useMemo((): Record<InitiativeStatus, Initiative[]> => {
    const columns: Record<InitiativeStatus, Initiative[]> = {
      'Not Started': [],
      'In Progress': [],
      'On Hold': [],
      'At Risk': [],
      'Completed': [],
    };

    if (!initiatives) return columns;

    initiatives.forEach((initiative) => {
      if (columns[initiative.status]) {
        columns[initiative.status].push(initiative);
      }
    });

    return columns;
  }, [initiatives]);

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
        subtitle="Strategic initiatives overview (read-only)"
      />

      <FilterBar />

      <KanbanBoard columns={COLUMNS} data={columnData} />

      <InitiativeModal />
    </>
  );
}
