import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ClicksLineChart({ data = [] }) {
  const chartData = data.map(d => ({
    date: d.date ? d.date.slice(5) : '',   // "2024-01-15" → "01-15"
    Clicks: d.clicks || 0,
    Impressions: d.impressions || 0,
  }));

  return (
    <div style={{ background: '#1a1d27', borderRadius: 12, padding: '20px 24px', border: '1px solid #ffffff0d' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 16 }}>
        Clicks &amp; Impressions — Last 7 Days
      </div>
      {chartData.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#4a5568', padding: '60px 0', fontSize: 13 }}>
          No historical data yet — metrics appear after day 2
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" />
            <XAxis dataKey="date" tick={{ fill: '#8892a4', fontSize: 12 }} />
            <YAxis tick={{ fill: '#8892a4', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#1a1d27', border: '1px solid #ffffff1a', borderRadius: 8, color: '#e2e8f0' }}
            />
            <Legend wrapperStyle={{ color: '#8892a4', fontSize: 12 }} />
            <Line type="monotone" dataKey="Impressions" stroke="#6366f1" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Clicks"      stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
