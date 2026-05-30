export default function KpiCard({ title, value, subtitle, icon, gradient, change }) {
  const isPositive = change >= 0;
  return (
    <div style={{ ...card, background: gradient, position: 'relative', overflow: 'hidden' }}>
      {/* Glow orb */}
      <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100,
        borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ fontSize: 28 }}>{icon}</div>
        {change !== undefined && (
          <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
            background: isPositive ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)',
            color: isPositive ? '#4ade80' : '#f87171' }}>
            {isPositive ? '▲' : '▼'} {Math.abs(change)}%
          </span>
        )}
      </div>

      <div style={{ fontSize: 38, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 6, letterSpacing: -1 }}>
        {value ?? <span style={{ opacity: 0.3, fontSize: 24 }}>—</span>}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 2 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{subtitle}</div>}
    </div>
  );
}

const card = {
  borderRadius: 16,
  padding: '20px 22px 18px',
  cursor: 'default',
  transition: 'transform 0.2s',
};
