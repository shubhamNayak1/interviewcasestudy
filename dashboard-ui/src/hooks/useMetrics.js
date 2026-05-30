import { useState, useEffect, useCallback } from 'react';
import { insightsApi } from '../api/insightsApi';

export function useMetrics(tenantId, campaignId) {
  const [metrics, setMetrics]       = useState(null);
  const [daily, setDaily]           = useState([]);
  const [browsers, setBrowsers]     = useState([]);
  const [countries, setCountries]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetch = useCallback(async () => {
    if (!tenantId || !campaignId) return;
    try {
      const [m, d, b, c] = await Promise.all([
        insightsApi.getFullMetrics(tenantId, campaignId),
        insightsApi.getDailyMetrics(tenantId, campaignId),
        insightsApi.getBrowserBreakdown(tenantId, campaignId),
        insightsApi.getCountryBreakdown(tenantId, campaignId),
      ]);
      setMetrics(m);
      setDaily(d);
      setBrowsers(b);
      setCountries(c);
      setError(null);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tenantId, campaignId]);

  // Initial load + auto-refresh every 10 seconds
  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 10000);
    return () => clearInterval(interval);
  }, [fetch]);

  return { metrics, daily, browsers, countries, loading, error, lastRefresh, refresh: fetch };
}

export function useCampaignList(tenantId) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!tenantId) return;
    insightsApi.getAllCampaigns(tenantId)
      .then(data => { setCampaigns(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [tenantId]);

  return { campaigns, loading };
}
