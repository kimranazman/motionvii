import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import type { Event } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface CategoryBreakdownProps {
  events: Event[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Conference': '#8b5cf6',
  'Exhibition': '#ec4899',
  'Training': '#14b8a6',
  'Workshop': '#f97316',
  'Networking': '#06b6d4',
  'Seminar': '#a855f7',
  'Other': '#6b7280',
};

export function CategoryBreakdown({ events }: CategoryBreakdownProps) {
  const { countData, costData } = useMemo(() => {
    const categoryStats: Record<
      string,
      { count: number; cost: number }
    > = {};

    events.forEach((event) => {
      const category = event.category || 'Other';
      if (!categoryStats[category]) {
        categoryStats[category] = { count: 0, cost: 0 };
      }
      categoryStats[category].count++;
      categoryStats[category].cost += event.estimatedCost;
    });

    const countData = Object.entries(categoryStats).map(([category, stats]) => ({
      name: category,
      value: stats.count,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'],
    }));

    const costData = Object.entries(categoryStats).map(([category, stats]) => ({
      name: category,
      value: stats.cost,
      color: CATEGORY_COLORS[category] || CATEGORY_COLORS['Other'],
    }));

    return { countData, costData };
  }, [events]);

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6">
        Event Category Breakdown
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* By Count */}
        <div>
          <h4 className="text-sm text-text-muted mb-4 text-center">
            By Number of Events
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={countData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {countData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => [`${value} events`, 'Count']}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-text-secondary text-xs">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By Cost */}
        <div>
          <h4 className="text-sm text-text-muted mb-4 text-center">
            By Budget Allocation
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {costData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value) => [formatCurrency(value as number), 'Budget']}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-text-secondary text-xs">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-text-muted font-medium">
                Category
              </th>
              <th className="text-right py-2 text-text-muted font-medium">
                Events
              </th>
              <th className="text-right py-2 text-text-muted font-medium">
                Budget
              </th>
              <th className="text-right py-2 text-text-muted font-medium">
                Avg. Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {countData.map((item) => {
              const costItem = costData.find((c) => c.name === item.name);
              const avgCost =
                costItem && item.value > 0
                  ? costItem.value / item.value
                  : 0;

              return (
                <tr
                  key={item.name}
                  className="border-b border-border/50 hover:bg-surface-hover"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-text-primary">{item.name}</span>
                    </div>
                  </td>
                  <td className="text-right text-text-secondary">
                    {item.value}
                  </td>
                  <td className="text-right text-text-secondary">
                    {formatCurrency(costItem?.value || 0)}
                  </td>
                  <td className="text-right text-text-secondary">
                    {formatCurrency(avgCost)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
