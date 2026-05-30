import { useState, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import FunnelChart from '../components/FunnelChart';
import BreakdownPie from '../components/BreakdownPie';
import ClicksLineChart from '../components/ClicksLineChart';
import CampaignSelector from '../components/CampaignSelector';
import { useMetrics, useCampaignList } from '../hooks/useMetrics';

const TENANTS = [
  { id: 'amazon',   label: 'Amazon',   color: '#FF9900', icon: '🛍️' },
  { id: 'flipkart', label: 'Flipkart', color: '#2874F0', icon: '🛒' },
  { id: 'walmart',  label: 'Walmart',  color: '#0071CE', icon: '🏪' },
];

const KPI_CONFIGS = [
  {
    key: 'impressions',
    title: 'Impressions',
    subtitle: 'Total ad views',
    icon: '👁️',
    gradient: 'linear-gradient(135deg, #312e81 0%, #4338ca 100%)',
    change: null,
    format: v => v.toLocaleString(),
  },
  {
    key: 'clicks',
    title: 'Clicks',
    subtitle: 'Ad engagements',
    icon: '🖱️',
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
    change: null,
    format: v => v.toLocaleString(),
  },
  {
    key: 'ctr',
    title: 'CTR',
    subtitle: 'Click-through rate',
    icon: '📈',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
    change: null,
    format: v => `${(v * 100).toFixed(2)}%`,
  },
  {
    key: 'clickToBasket',
    title: 'Click → Basket',
    subtitle: 'Conversion rate',
    icon: '🛒',
    gradient: 'linear-gradient(135deg, #701a75 0%, #db2777 100%)',
    change: null,
    format: v => `${(v * 100).toFixed(2)}%`,
  },
];

function InsightBadge({ label, value, accent }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '12px 16px',
      border: `1px solid ${accent}33`, flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: accent }}>{value}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const [tenantId, setTenantId]     = useState('amazon');
  const [campaignId, setCampaignId] = useState(null);

  const { campaigns } = useCampaignList(tenantId);
  const { metrics, daily, browsers, countries, loading, error, lastRefresh, refresh } = useMetrics(tenantId, campaignId);

  useEffect(() => {
    if (campaigns.length > 0) setCampaignId(campaigns[0].campaignId);
  }, [tenantId, campaigns]);

  const tenant = TENANTS.find(t => t.id === tenantId);

  // Derived insight numbers
  const totalImpressions = campaigns.reduce((s, c) => s + (c.impressions || 0), 0);
  const totalClicks      = campaigns.reduce((s, c) => s + (c.clicks || 0), 0);
  const totalAtc         = campaigns.reduce((s, c) => s + (c.addToCart || 0), 0);
  const bestCampaign     = campaigns.length
    ? [...campaigns].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]
    : null;

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', padding: '0 0 48px', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #080c14 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', gap: 24,
        position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #818cf8, #6366f1)',
            borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            📊
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#f1f5f9', letterSpacing: -0.5 }}>AdTech Insights</div>
            <div style={{ fontSize: 10, color: '#475569', letterSpacing: 1, textTransform: 'uppercase' }}>Retail Media Network</div>
          </div>
        </div>

        {/* Tenant switcher */}
        <div style={{ display: 'flex', gap: 6, marginLeft: 16 }}>
          {TENANTS.map(t => (
            <button key={t.id} onClick={() => setTenantId(t.id)} style={{
              padding: '6px 16px', borderRadius: 20, border: '1.5px solid',
              borderColor: tenantId === t.id ? t.color : 'rgba(255,255,255,0.08)',
              background: tenantId === t.id ? `${t.color}18` : 'transparent',
              color: tenantId === t.id ? t.color : '#64748b',
              fontWeight: tenantId === t.id ? 700 : 400,
              cursor: 'pointer', fontSize: 13, transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {lastRefresh && (
            <span style={{ fontSize: 11, color: '#334155' }}>
              {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <span style={{ fontSize: 11, color: '#4ade80', background: 'rgba(74,222,128,0.08)',
            padding: '4px 12px', borderRadius: 20, border: '1px solid rgba(74,222,128,0.2)', fontWeight: 600 }}>
            ● Live · 10s
          </span>
          <button onClick={refresh} style={{
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff',
            border: 'none', borderRadius: 8, padding: '6px 14px',
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}>
            ↻ Refresh
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1320, margin: '0 auto', padding: '24px 32px' }}>

        {/* ── Campaign selector ──────────────────────────────────────── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600 }}>
            Campaign
          </div>
          {campaigns.length > 0
            ? <CampaignSelector campaigns={campaigns} selected={campaignId} onSelect={setCampaignId} />
            : <div style={{ color: '#334155', fontSize: 13, padding: '12px 0' }}>
                No campaigns yet — open the retail site and browse some sponsored products.
              </div>
          }
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 10, padding: '12px 16px', marginBottom: 20, color: '#fca5a5', fontSize: 13, display: 'flex', gap: 8 }}>
            <span>⚠</span>
            <span>Could not reach Insights API: {error}. Make sure the backend is running.</span>
          </div>
        )}

        {/* ── KPI Cards ─────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
          {KPI_CONFIGS.map(cfg => {
            const raw = metrics?.[cfg.key];
            const val = raw !== undefined && raw !== null ? cfg.format(raw) : null;
            return (
              <KpiCard
                key={cfg.key}
                title={cfg.title}
                value={loading ? '…' : val}
                subtitle={cfg.subtitle}
                icon={cfg.icon}
                gradient={cfg.gradient}
              />
            );
          })}
        </div>

        {/* ── Tenant-level insights strip ────────────────────────────── */}
        {campaigns.length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <InsightBadge label="Total impressions across all campaigns" value={totalImpressions.toLocaleString()} accent="#818cf8" />
            <InsightBadge label="Total clicks across all campaigns"      value={totalClicks.toLocaleString()}      accent="#fb923c" />
            <InsightBadge label="Total add-to-cart conversions"          value={totalAtc.toLocaleString()}         accent="#34d399" />
            {bestCampaign && (
              <InsightBadge
                label="Best performing campaign"
                value={bestCampaign.campaignId}
                accent="#f472b6"
              />
            )}
            <InsightBadge
              label="Overall tenant CTR"
              value={totalImpressions > 0 ? `${(totalClicks / totalImpressions * 100).toFixed(2)}%` : '—'}
              accent="#38bdf8"
            />
          </div>
        )}

        {/* ── Charts row 1 ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 14, marginBottom: 14 }}>
          <ClicksLineChart data={daily} />
          <FunnelChart
            impressions={metrics?.impressions || 0}
            clicks={metrics?.clicks || 0}
            addToCart={metrics?.addToCart || 0}
          />
        </div>

        {/* ── Charts row 2 ─────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <BreakdownPie title="Browser Distribution" data={browsers} icon="🌐" />
          <BreakdownPie title="Country Distribution"  data={countries} icon="🌍" />
        </div>

        {/* ── Campaign comparison table ──────────────────────────────── */}
        {campaigns.length > 0 && (
          <div style={{ background: '#111827', borderRadius: 16, padding: '20px 22px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>
                {tenant.icon} {tenant.label} — All Campaigns
              </span>
              <span style={{ fontSize: 11, color: '#475569', background: 'rgba(255,255,255,0.04)',
                padding: '3px 10px', borderRadius: 12 }}>
                {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
              </span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Campaign', 'Impressions', 'Clicks', 'CTR', 'Add to Cart', 'Click→Basket', 'Score'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600,
                      color: '#475569', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: 11,
                      textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => {
                  const isSelected = campaignId === c.campaignId;
                  const score = ((c.ctr || 0) * 50 + (c.clickToBasket || 0) * 50).toFixed(0);
                  return (
                    <tr key={c.campaignId}
                      onClick={() => setCampaignId(c.campaignId)}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        background: isSelected ? 'rgba(129,140,248,0.07)' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '11px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {isSelected && <div style={{ width: 3, height: 16, background: '#818cf8', borderRadius: 2 }} />}
                          <span style={{ color: '#818cf8', fontWeight: 700 }}>{c.campaignId}</span>
                        </div>
                      </td>
                      <td style={{ padding: '11px 12px', color: '#cbd5e1' }}>{(c.impressions || 0).toLocaleString()}</td>
                      <td style={{ padding: '11px 12px', color: '#cbd5e1' }}>{(c.clicks || 0).toLocaleString()}</td>
                      <td style={{ padding: '11px 12px' }}>
                        <span style={{ color: '#34d399', fontWeight: 600 }}>{((c.ctr || 0) * 100).toFixed(2)}%</span>
                      </td>
                      <td style={{ padding: '11px 12px', color: '#cbd5e1' }}>{(c.addToCart || 0).toLocaleString()}</td>
                      <td style={{ padding: '11px 12px' }}>
                        <span style={{ color: '#f472b6', fontWeight: 600 }}>{((c.clickToBasket || 0) * 100).toFixed(2)}%</span>
                      </td>
                      <td style={{ padding: '11px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 4, background: '#1e293b', borderRadius: 4, maxWidth: 60 }}>
                            <div style={{ width: `${Math.min(score, 100)}%`, height: '100%',
                              background: 'linear-gradient(90deg, #818cf8, #f472b6)', borderRadius: 4 }} />
                          </div>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>{score}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
