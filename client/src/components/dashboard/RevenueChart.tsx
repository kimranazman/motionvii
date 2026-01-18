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
    <div className="glass rounded-xl p-6">
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
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTraining" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="month"
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 17, 17, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Area
              type="monotone"
              dataKey="events"
              stroke="#00d4ff"
              fillOpacity={1}
              fill="url(#colorEvents)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="training"
              stroke="#00ff88"
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
