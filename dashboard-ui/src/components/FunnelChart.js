export default function FunnelChart({ impressions = 0, clicks = 0, addToCart = 0 }) {
  const max = impressions || 1;
  const steps = [
    { label: 'Impressions', value: impressions, color: '#6366f1', pct: 100 },
    { label: 'Clicks',      value: clicks,      color: '#f59e0b', pct: impressions ? Math.round((clicks / impressions) * 100) : 0 },
    { label: 'Add to Cart', value: addToCart,   color: '#10b981', pct: impressions ? Math.round((addToCart / impressions) * 100) : 0 },
  ];

  return (
    <div style={{ background: '#1a1d27', borderRadius: 12, padding: '20px 24px', border: '1px solid #ffffff0d' }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 20 }}>Conversion Funnel</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {steps.map((step, i) => (
          <div key={step.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#8892a4' }}>{step.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: step.color }}>
                {step.value.toLocaleString()} <span style={{ color: '#8892a4', fontWeight: 400 }}>({step.pct}%)</span>
              </span>
            </div>
            <div style={{ background: '#0f1117', borderRadius: 6, height: 14, overflow: 'hidden' }}>
              <div style={{
                width: `${step.pct}%`,
                height: '100%',
                background: step.color,
                borderRadius: 6,
                transition: 'width 0.6s ease',
                minWidth: step.value > 0 ? 4 : 0,
              }} />
            </div>
            {i < steps.length - 1 && (
              <div style={{ textAlign: 'center', color: '#4a5568', fontSize: 18, margin: '2px 0' }}>↓</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
