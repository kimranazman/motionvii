import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DepartmentChartProps {
  data: Record<string, number>;
}

export function DepartmentChart({ data }: DepartmentChartProps) {
  const chartData = Object.entries(data)
    .map(([department, count]) => ({
      department,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Department Workload
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              horizontal={false}
            />
            <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={12} />
            <YAxis
              dataKey="department"
              type="category"
              stroke="rgba(255,255,255,0.5)"
              fontSize={12}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(17, 17, 17, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#fff',
              }}
              formatter={(value: number) => [`${value} initiatives`, 'Count']}
            />
            <Bar
              dataKey="count"
              fill="url(#barGradient)"
              radius={[0, 4, 4, 0]}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00d4ff" />
                <stop offset="100%" stopColor="#0066ff" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
