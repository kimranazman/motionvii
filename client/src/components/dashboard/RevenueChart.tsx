import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface RevenueChartProps {
  target: number;
  current: number;
}

// Generate monthly projection data
function generateMonthlyData(target: number, current: number) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthlyTarget = target / 12;
  let cumulative = 0;

  return months.map((month, index) => {
    // Simulate some variance in actual revenue
    const progress = index < new Date().getMonth()
      ? monthlyTarget * (0.8 + Math.random() * 0.4)
      : 0;
    cumulative += progress;

    return {
      month,
      target: monthlyTarget * (index + 1),
      actual: cumulative,
      events: monthlyTarget * 0.8 * (index + 1),
      training: monthlyTarget * 0.2 * (index + 1),
    };
  });
}

export function RevenueChart({ target, current }: RevenueChartProps) {
  const data = generateMonthlyData(target, current);

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            Revenue Progress
          </h3>
          <p className="text-sm text-text-muted">
            Target: {formatCurrency(target)}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-text-secondary">Events (80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-xs text-text-secondary">Training (20%)</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTraining" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              fontSize={12}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#0f172a',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value) => formatCurrency(value as number)}
            />
            <Area
              type="monotone"
              dataKey="events"
              stroke="#6366f1"
              fillOpacity={1}
              fill="url(#colorEvents)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="training"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorTraining)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
