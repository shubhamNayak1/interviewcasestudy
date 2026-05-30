import { useState, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import FunnelChart from '../components/FunnelChart';
import BreakdownPie from '../components/BreakdownPie';
import ClicksLineChart from '../components/ClicksLineChart';
import CampaignSelector from '../components/CampaignSelector';
import { useMetrics, useCampaignList } from '../hooks/useMetrics';

const TENANTS = [
  { id: 'amazon',   label: 'Amazon',   color: '#FF9900' },
  { id: 'flipkart', label: 'Flipkart', color: '#2874F0' },
  { id: 'walmart',  label: 'Walmart',  color: '#0071CE' },
];

export default function DashboardPage() {
  const [tenantId, setTenantId]     = useState('amazon');
  const [campaignId, setCampaignId] = useState(null);

  const { campaigns } = useCampaignList(tenantId);
  const { metrics, daily, browsers, countries, loading, error, lastRefresh, refresh } = useMetrics(tenantId, campaignId);

  // Auto-select first campaign when tenant or campaign list changes
  useEffect(() => {
    if (campaigns.length > 0) setCampaignId(campaigns[0].campaignId);
  }, [tenantId, campaigns]);

  const tenant = TENANTS.find(t => t.id === tenantId);

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', padding: '0 0 40px' }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ background: '#1a1d27', borderBottom: '1px solid #ffffff0d', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#fff' }}>
          📊 AdTech Dashboard
        </div>

        {/* Tenant switcher */}
        <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
          {TENANTS.map(t => (
            <button
              key={t.id}
              onClick={() => setTenantId(t.id)}
              style={{
                padding: '6px 18px', borderRadius: 20, border: '2px solid',
                borderColor: tenantId === t.id ? t.color : 'transparent',
                background: tenantId === t.id ? `${t.color}22` : 'transparent',
                color: tenantId === t.id ? t.color : '#8892a4',
                fontWeight: tenantId === t.id ? 700 : 400,
                cursor: 'pointer', fontSize: 13, transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
          {lastRefresh && (
            <span style={{ fontSize: 12, color: '#4a5568' }}>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <span style={{ fontSize: 12, color: '#4ade80', background: '#4ade8022', padding: '4px 10px', borderRadius: 20 }}>
            ● Live · 10s refresh
          </span>
          <button
            onClick={refresh}
            style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13 }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px' }}>

        {/* ── Campaign selector ──────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: '#8892a4', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            Campaign
          </div>
          {campaigns.length > 0
            ? <CampaignSelector campaigns={campaigns} selected={campaignId} onSelect={setCampaignId} />
            : <div style={{ color: '#4a5568', fontSize: 13 }}>No campaigns yet — open the retail site and browse some sponsored products.</div>
          }
        </div>

        {error && (
          <div style={{ background: '#ef444422', border: '1px solid #ef4444', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#fca5a5', fontSize: 13 }}>
            ⚠ Could not reach Insights API: {error}. Make sure the backend is running.
          </div>
        )}

        {/* ── KPI Cards ─────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <KpiCard
            title="Impressions"
            value={metrics ? metrics.impressions.toLocaleString() : null}
            subtitle="Ad views"
            icon="👁️"
            color="#6366f1"
          />
          <KpiCard
            title="Clicks"
            value={metrics ? metrics.clicks.toLocaleString() : null}
            subtitle="Ad clicks"
            icon="🖱️"
            color="#f59e0b"
          />
          <KpiCard
            title="CTR"
            value={metrics ? `${(metrics.ctr * 100).toFixed(2)}%` : null}
            subtitle="Clicks / Impressions"
            icon="📈"
            color="#10b981"
          />
          <KpiCard
            title="Click to Basket"
            value={metrics ? `${(metrics.clickToBasket * 100).toFixed(2)}%` : null}
            subtitle="Add to Cart / Clicks"
            icon="🛒"
            color="#ec4899"
          />
        </div>

        {/* ── Charts row 1 ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <ClicksLineChart data={daily} />
          <FunnelChart
            impressions={metrics?.impressions || 0}
            clicks={metrics?.clicks || 0}
            addToCart={metrics?.addToCart || 0}
          />
        </div>

        {/* ── Charts row 2 ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <BreakdownPie title="Browser Distribution" data={browsers} />
          <BreakdownPie title="Country Distribution" data={countries} />
        </div>

        {/* ── Raw numbers table ─────────────────────────────────────── */}
        {campaigns.length > 0 && (
          <div style={{ marginTop: 16, background: '#1a1d27', borderRadius: 12, padding: '20px 24px', border: '1px solid #ffffff0d' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', marginBottom: 16 }}>All Campaigns — {tenant.label}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ color: '#8892a4', borderBottom: '1px solid #ffffff0d' }}>
                  {['Campaign', 'Impressions', 'Clicks', 'CTR', 'Add to Cart', 'Click to Basket'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.campaignId} style={{ borderBottom: '1px solid #ffffff05', cursor: 'pointer', background: campaignId === c.campaignId ? '#6366f111' : 'transparent' }}
                    onClick={() => setCampaignId(c.campaignId)}>
                    <td style={{ padding: '10px 12px', color: '#6366f1', fontWeight: 600 }}>{c.campaignId}</td>
                    <td style={{ padding: '10px 12px' }}>{(c.impressions || 0).toLocaleString()}</td>
                    <td style={{ padding: '10px 12px' }}>{(c.clicks || 0).toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', color: '#10b981' }}>{((c.ctr || 0) * 100).toFixed(2)}%</td>
                    <td style={{ padding: '10px 12px' }}>{(c.addToCart || 0).toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', color: '#ec4899' }}>{((c.clickToBasket || 0) * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
