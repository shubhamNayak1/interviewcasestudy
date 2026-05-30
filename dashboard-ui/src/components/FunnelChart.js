export default function FunnelChart({ impressions = 0, clicks = 0, addToCart = 0 }) {
  const steps = [
    { label: 'Impressions', value: impressions, color: '#818cf8', bg: 'rgba(129,140,248,0.15)', pct: 100, icon: '👁️' },
    { label: 'Clicks',      value: clicks,      color: '#fb923c', bg: 'rgba(251,146,60,0.15)',  pct: impressions ? ((clicks / impressions) * 100).toFixed(1) : 0, icon: '🖱️' },
    { label: 'Add to Cart', value: addToCart,   color: '#34d399', bg: 'rgba(52,211,153,0.15)',  pct: impressions ? ((addToCart / impressions) * 100).toFixed(1) : 0, icon: '🛒' },
  ];

  return (
    <div style={card}>
      <div style={header}>
        <span style={title}>Conversion Funnel</span>
        <span style={badge}>Live</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
        {steps.map((step, i) => (
          <div key={step.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{step.icon}</span>
                <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 500 }}>{step.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: step.color }}>
                  {step.value.toLocaleString()}
                </span>
                <span style={{ fontSize: 11, background: step.bg, color: step.color,
                  padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>
                  {step.pct}%
                </span>
              </div>
            </div>
            <div style={{ background: '#1e293b', borderRadius: 8, height: 10, overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(step.pct, step.value > 0 ? 2 : 0)}%`, height: '100%',
                background: `linear-gradient(90deg, ${step.color}cc, ${step.color})`,
                borderRadius: 8, transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
            </div>
            {i < steps.length - 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '6px 0 0 4px' }}>
                <div style={{ width: 1, height: 12, background: '#334155', marginLeft: 8 }} />
                {clicks > 0 && i === 0 && (
                  <span style={{ fontSize: 10, color: '#64748b' }}>
                    {((clicks / Math.max(impressions, 1)) * 100).toFixed(1)}% CTR
                  </span>
                )}
                {addToCart > 0 && i === 1 && (
                  <span style={{ fontSize: 10, color: '#64748b' }}>
                    {((addToCart / Math.max(clicks, 1)) * 100).toFixed(1)}% of clicks converted
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const card  = { background: '#111827', borderRadius: 16, padding: '20px 22px', border: '1px solid rgba(255,255,255,0.06)' };
const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 };
const title  = { fontSize: 14, fontWeight: 700, color: '#e2e8f0' };
const badge  = { fontSize: 11, color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '2px 10px', borderRadius: 20, fontWeight: 600 };
