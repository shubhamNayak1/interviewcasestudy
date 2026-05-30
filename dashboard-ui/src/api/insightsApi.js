const BASE_URL = process.env.REACT_APP_INSIGHTS_URL || 'http://localhost:8081';

async function get(path, tenantId) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'X-Tenant-ID': tenantId },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data;
}

export const insightsApi = {
  getAllCampaigns:     (tenantId)             => get(`/tenant/campaigns`, tenantId),
  getFullMetrics:     (tenantId, campaignId) => get(`/campaign/${campaignId}/metrics`, tenantId),
  getDailyMetrics:    (tenantId, campaignId) => get(`/campaign/${campaignId}/daily?days=7`, tenantId),
  getBrowserBreakdown:(tenantId, campaignId) => get(`/campaign/${campaignId}/browser-breakdown`, tenantId),
  getCountryBreakdown:(tenantId, campaignId) => get(`/campaign/${campaignId}/country-breakdown`, tenantId),
};
