import { useMemo } from 'react';
import type { Event } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';

interface EventsHeatmapProps {
  events: Event[];
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, september: 8, sept: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

function getMonthIndex(dateMonth: string): number {
  if (!dateMonth) return -1;
  const lower = dateMonth.toLowerCase();

  for (const [key, index] of Object.entries(MONTH_MAP)) {
    if (lower.includes(key)) {
      return index;
    }
  }
  return -1;
}

export function EventsHeatmap({ events }: EventsHeatmapProps) {
  const heatmapData = useMemo(() => {
    const data = MONTHS.map((month, index) => ({
      month,
      count: 0,
      cost: 0,
    }));

    events.forEach((event) => {
      const monthIndex = getMonthIndex(event.dateMonth);
      if (monthIndex >= 0) {
        data[monthIndex].count++;
        data[monthIndex].cost += event.estimatedCost;
      }
    });

    const maxCount = Math.max(...data.map((d) => d.count), 1);

    return data.map((d) => ({
      ...d,
      intensity: d.count / maxCount,
    }));
  }, [events]);

  const totalCost = events.reduce((sum, e) => sum + e.estimatedCost, 0);

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">
          Events by Month
        </h3>
        <span className="text-sm text-text-muted">
          Total: {formatCurrency(totalCost)}
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {heatmapData.map((data) => (
          <div
            key={data.month}
            className={cn(
              'p-3 rounded-lg text-center transition-all duration-200',
              'border border-border hover:border-border-hover'
            )}
            style={{
              backgroundColor: `rgba(0, 212, 255, ${data.intensity * 0.4})`,
            }}
          >
            <p className="text-xs text-text-muted mb-1">{data.month}</p>
            <p className="text-xl font-bold text-text-primary">{data.count}</p>
            {data.cost > 0 && (
              <p className="text-xs text-text-muted mt-1">
                {formatCurrency(data.cost)}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <span className="text-xs text-text-muted">Less</span>
        <div className="flex gap-1">
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity) => (
            <div
              key={intensity}
              className="w-4 h-4 rounded"
              style={{
                backgroundColor: `rgba(0, 212, 255, ${intensity * 0.4})`,
              }}
            />
          ))}
        </div>
        <span className="text-xs text-text-muted">More</span>
      </div>
    </div>
  );
}
