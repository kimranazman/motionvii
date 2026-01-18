import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { InitiativeStatus } from '@/types';

interface StatusChartProps {
  data: Record<InitiativeStatus, number>;
}

const STATUS_COLORS: Record<InitiativeStatus, string> = {
  'Not Started': '#6b7280',
  'In Progress': '#3b82f6',
  'On Hold': '#f59e0b',
  'At Risk': '#ef4444',
  'Completed': '#22c55e',
};

export function StatusChart({ data }: StatusChartProps) {
  const chartData = Object.entries(data).map(([status, count]) => ({
    name: status,
    value: count,
    color: STATUS_COLORS[status as InitiativeStatus],
  }));

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Initiative Status
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 17, 17, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend
              formatter={(value) => (
                <span className="text-text-secondary text-sm">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
