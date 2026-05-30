export default function KpiCard({ title, value, subtitle, icon, color, trend }) {
  return (
    <div style={{ background: '#1a1d27', borderRadius: 12, padding: '20px 24px', border: `1px solid ${color}22`, position: 'relative', overflow: 'hidden' }}>
      {/* Glow accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: color, borderRadius: '12px 12px 0 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: '#8892a4', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            {title}
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
            {value ?? <span style={{ fontSize: 20, opacity: 0.4 }}>—</span>}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: '#8892a4', marginTop: 6 }}>{subtitle}</div>
          )}
        </div>
        <div style={{ fontSize: 32, opacity: 0.8 }}>{icon}</div>
      </div>

      {trend !== undefined && (
        <div style={{ marginTop: 12, fontSize: 12, color: trend >= 0 ? '#4ade80' : '#f87171', fontWeight: 600 }}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% vs yesterday
        </div>
      )}
    </div>
  );
}
