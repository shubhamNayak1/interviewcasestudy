import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];

export default function BreakdownPie({ title, data = [] }) {
  const chartData = data.map(d => ({ name: d.label, value: d.count }));

  return (
    <div style={{ background: '#1a1d27', borderRadius: 12, padding: '20px 24px', border: '1px solid #ffffff0d' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 16 }}>{title}</div>
      {chartData.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#4a5568', padding: '40px 0', fontSize: 13 }}>No data yet — start browsing the retail site</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1a1d27', border: '1px solid #ffffff1a', borderRadius: 8, color: '#e2e8f0' }}
              formatter={(val) => [val.toLocaleString(), 'Impressions']}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
