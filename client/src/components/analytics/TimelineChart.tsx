import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { Initiative } from '@/types';

interface TimelineChartProps {
  initiatives: Initiative[];
}

const STATUS_COLORS: Record<string, string> = {
  'Not Started': '#6b7280',
  'In Progress': '#3b82f6',
  'On Hold': '#f59e0b',
  'At Risk': '#ef4444',
  'Completed': '#22c55e',
};

export function TimelineChart({ initiatives }: TimelineChartProps) {
  const chartData = useMemo(() => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return months.map((month, index) => {
      const monthInitiatives = initiatives.filter((i) => {
        if (!i.startDate) return false;
        const startMonth = new Date(i.startDate).getMonth();
        const endMonth = i.endDate ? new Date(i.endDate).getMonth() : 11;
        return index >= startMonth && index <= endMonth;
      });

      const statusCounts = {
        'Not Started': 0,
        'In Progress': 0,
        'On Hold': 0,
        'At Risk': 0,
        'Completed': 0,
      };

      monthInitiatives.forEach((i) => {
        if (statusCounts[i.status] !== undefined) {
          statusCounts[i.status]++;
        }
      });

      return {
        month,
        ...statusCounts,
        total: monthInitiatives.length,
      };
    });
  }, [initiatives]);

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Initiative Timeline
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              fontSize={12}
            />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#0f172a',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="Completed" stackId="a" fill={STATUS_COLORS['Completed']} />
            <Bar dataKey="In Progress" stackId="a" fill={STATUS_COLORS['In Progress']} />
            <Bar dataKey="On Hold" stackId="a" fill={STATUS_COLORS['On Hold']} />
            <Bar dataKey="At Risk" stackId="a" fill={STATUS_COLORS['At Risk']} />
            <Bar dataKey="Not Started" stackId="a" fill={STATUS_COLORS['Not Started']} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-text-muted">{status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
