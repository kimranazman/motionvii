import { Search, X, Filter } from 'lucide-react';
import { useAppStore } from '@/store';
import { useInitiatives } from '@/hooks/useInitiatives';
import { useMemo, useState } from 'react';
import { InitiativeStatus } from '@/types';

const STATUSES: InitiativeStatus[] = [
  'Not Started',
  'In Progress',
  'On Hold',
  'At Risk',
  'Completed',
];

export function FilterBar() {
  const { initiativeFilters, setInitiativeFilters, clearFilters } = useAppStore();
  const { data: initiatives } = useInitiatives();
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique values for filters
  const filterOptions = useMemo(() => {
    if (!initiatives) return { departments: [], persons: [] };

    const departments = [...new Set(initiatives.map((i) => i.department).filter(Boolean))];
    const persons = [...new Set(initiatives.map((i) => i.personInCharge).filter(Boolean))];

    return { departments, persons };
  }, [initiatives]);

  const hasActiveFilters = Object.values(initiativeFilters).some(Boolean);

  return (
    <div className="mb-6 space-y-4">
      {/* Search and Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search initiatives..."
            value={initiativeFilters.search || ''}
            onChange={(e) => setInitiativeFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
          />
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-primary/10 border-primary/30 text-primary'
              : 'bg-surface border-border text-text-secondary hover:text-text-primary'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-5 h-5 flex items-center justify-center text-xs bg-primary rounded-full text-white">
              {Object.values(initiativeFilters).filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-border text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 glass rounded-lg">
          {/* Status Filter */}
          <div>
            <label className="block text-sm text-text-muted mb-2">Status</label>
            <select
              value={initiativeFilters.status || ''}
              onChange={(e) =>
                setInitiativeFilters({
                  status: (e.target.value as InitiativeStatus) || undefined,
                })
              }
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/50"
            >
              <option value="">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm text-text-muted mb-2">
              Department
            </label>
            <select
              value={initiativeFilters.department || ''}
              onChange={(e) =>
                setInitiativeFilters({ department: e.target.value || undefined })
              }
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/50"
            >
              <option value="">All departments</option>
              {filterOptions.departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Person Filter */}
          <div>
            <label className="block text-sm text-text-muted mb-2">
              Person in Charge
            </label>
            <select
              value={initiativeFilters.personInCharge || ''}
              onChange={(e) =>
                setInitiativeFilters({
                  personInCharge: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary/50"
            >
              <option value="">All people</option>
              {filterOptions.persons.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
