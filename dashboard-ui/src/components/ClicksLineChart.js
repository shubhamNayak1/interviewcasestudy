import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
      padding: '10px 14px', fontSize: 12, minWidth: 140 }}>
      <div style={{ color: '#94a3b8', marginBottom: 8, fontWeight: 600 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', justifyContent: 'space-between', gap: 16,
          color: p.color, marginBottom: 3 }}>
          <span>{p.name}</span>
          <span style={{ fontWeight: 700 }}>{p.value.toLocaleString()}</span>
        </div>
      ))}
      {payload.length >= 2 && payload[0].value > 0 && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8, paddingTop: 6,
          color: '#64748b', fontSize: 11 }}>
          CTR: {((payload[1]?.value || 0) / payload[0].value * 100).toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default function ClicksLineChart({ data = [] }) {
  const chartData = data.map(d => ({
    date: d.date ? d.date.slice(5) : '',
    Impressions: d.impressions || 0,
    Clicks: d.clicks || 0,
    'Add to Cart': d.addToCart || 0,
  }));

  const maxVal = Math.max(...chartData.map(d => d.Impressions), 1);
  const avgClicks = chartData.length
    ? Math.round(chartData.reduce((s, d) => s + d.Clicks, 0) / chartData.length)
    : 0;

  return (
    <div style={{ background: '#111827', borderRadius: 16, padding: '20px 22px', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>📅 7-Day Performance</span>
        {avgClicks > 0 && (
          <span style={{ fontSize: 11, color: '#fb923c', background: 'rgba(251,146,60,0.1)',
            padding: '2px 10px', borderRadius: 12, fontWeight: 600 }}>
            avg {avgClicks} clicks/day
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
        {[
          { label: 'Impressions', color: '#818cf8' },
          { label: 'Clicks',      color: '#fb923c' },
          { label: 'Add to Cart', color: '#34d399' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8' }}>
            <div style={{ width: 20, height: 3, borderRadius: 2, background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>

      {chartData.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#334155', padding: '60px 0', fontSize: 13 }}>
          No historical data yet — metrics appear after day 2
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradImp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradClk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#fb923c" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradAtc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#34d399" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#4b5563', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            {avgClicks > 0 && (
              <ReferenceLine y={avgClicks} stroke="#fb923c" strokeDasharray="4 4" strokeOpacity={0.4} />
            )}
            <Area type="monotone" dataKey="Impressions" stroke="#818cf8" strokeWidth={2} fill="url(#gradImp)" dot={false} />
            <Area type="monotone" dataKey="Clicks"      stroke="#fb923c" strokeWidth={2} fill="url(#gradClk)" dot={false} />
            <Area type="monotone" dataKey="Add to Cart" stroke="#34d399" strokeWidth={2} fill="url(#gradAtc)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
