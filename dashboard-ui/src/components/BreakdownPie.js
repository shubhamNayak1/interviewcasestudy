import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const PALETTES = {
  default: ['#818cf8', '#fb923c', '#34d399', '#f472b6', '#38bdf8', '#a78bfa', '#fbbf24', '#4ade80'],
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, percent } = payload[0].payload;
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
      padding: '10px 14px', fontSize: 13 }}>
      <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{name}</div>
      <div style={{ color: '#94a3b8' }}>{value.toLocaleString()} events</div>
      <div style={{ color: payload[0].fill, fontWeight: 700, marginTop: 2 }}>{(percent * 100).toFixed(1)}%</div>
    </div>
  );
};

const CustomLegend = ({ data, colors }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 12, justifyContent: 'center' }}>
    {data.map((d, i) => (
      <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i % colors.length], flexShrink: 0 }} />
        <span style={{ color: '#94a3b8' }}>{d.name}</span>
        <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{(d.value / data.reduce((a, b) => a + b.value, 0) * 100).toFixed(0)}%</span>
      </div>
    ))}
  </div>
);

export default function BreakdownPie({ title, data = [], icon = '📊' }) {
  const colors = PALETTES.default;
  const chartData = data.map(d => ({ name: d.label, value: d.count }));
  const total = chartData.reduce((a, b) => a + b.value, 0);
  const top = chartData.length > 0 ? [...chartData].sort((a, b) => b.value - a.value)[0] : null;

  return (
    <div style={{ background: '#111827', borderRadius: 16, padding: '20px 22px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{icon} {title}</span>
        {total > 0 && (
          <span style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(255,255,255,0.05)',
            padding: '2px 10px', borderRadius: 12 }}>
            {total.toLocaleString()} total
          </span>
        )}
      </div>

      {top && (
        <div style={{ fontSize: 11, color: '#64748b', marginBottom: 12 }}>
          Top: <span style={{ color: colors[chartData.indexOf(top) % colors.length], fontWeight: 600 }}>{top.name}</span>
          {' '}· {(top.value / total * 100).toFixed(0)}% share
        </div>
      )}

      {chartData.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#334155', padding: '48px 0', fontSize: 13 }}>
          No data yet — browse the retail site
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <CustomLegend data={chartData} colors={colors} />
        </>
      )}
    </div>
  );
}
