import { Search, X } from 'lucide-react';
import { useAppStore } from '@/store';
import { useEvents } from '@/hooks/useEvents';
import { useMemo } from 'react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function EventFilters() {
  const { eventFilters, setEventFilters, clearFilters } = useAppStore();
  const { data: events } = useEvents();

  // Extract unique categories
  const categories = useMemo(() => {
    if (!events) return [];
    return [...new Set(events.map((e) => e.category).filter(Boolean))];
  }, [events]);

  const hasActiveFilters = Object.values(eventFilters).some(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search events..."
          value={eventFilters.search || ''}
          onChange={(e) => setEventFilters({ search: e.target.value })}
          className="w-48 pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
        />
      </div>

      {/* Category Filter */}
      <select
        value={eventFilters.category || ''}
        onChange={(e) =>
          setEventFilters({ category: e.target.value || undefined })
        }
        className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Month Filter */}
      <select
        value={eventFilters.month || ''}
        onChange={(e) =>
          setEventFilters({ month: e.target.value || undefined })
        }
        className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:border-primary"
      >
        <option value="">All months</option>
        {MONTHS.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}
