package com.adtech.insights.service;

import com.adtech.insights.exception.CampaignNotFoundException;
import com.adtech.insights.exception.TenantAccessException;
import com.adtech.insights.model.BreakdownItem;
import com.adtech.insights.model.CampaignMetrics;
import com.adtech.insights.repository.MetricsRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class InsightsService {

    private final MetricsRepository repository;
    private final List<String> validTenants;

    public InsightsService(
            MetricsRepository repository,
            @Value("${adtech.valid-tenants}") String validTenantsConfig) {
        this.repository = repository;
        this.validTenants = Arrays.asList(validTenantsConfig.split(","));
    }

    public long getClicks(String tenantId, String campaignId) {
        return fetchMetrics(tenantId, campaignId).getClicks();
    }

    public long getImpressions(String tenantId, String campaignId) {
        return fetchMetrics(tenantId, campaignId).getImpressions();
    }

    public double getClickToBasket(String tenantId, String campaignId) {
        return fetchMetrics(tenantId, campaignId).getClickToBasket();
    }

    public double getCtr(String tenantId, String campaignId) {
        return fetchMetrics(tenantId, campaignId).getCtr();
    }

    public CampaignMetrics getFullMetrics(String tenantId, String campaignId) {
        return fetchMetrics(tenantId, campaignId);
    }

    public List<CampaignMetrics> getAllCampaigns(String tenantId) {
        validateTenant(tenantId);
        return repository.findAllByTenant(tenantId);
    }

    public List<CampaignMetrics> getDailyMetrics(String tenantId, String campaignId, int days) {
        validateTenant(tenantId);
        return repository.findDailyMetrics(tenantId, campaignId, days);
    }

    public List<BreakdownItem> getBrowserBreakdown(String tenantId, String campaignId) {
        validateTenant(tenantId);
        return repository.findBrowserBreakdown(tenantId, campaignId);
    }

    public List<BreakdownItem> getCountryBreakdown(String tenantId, String campaignId) {
        validateTenant(tenantId);
        return repository.findCountryBreakdown(tenantId, campaignId);
    }

    private CampaignMetrics fetchMetrics(String tenantId, String campaignId) {
        validateTenant(tenantId);
        return repository.findByCampaign(tenantId, campaignId)
                .orElseThrow(() -> new CampaignNotFoundException(campaignId));
    }

    private void validateTenant(String tenantId) {
        if (tenantId == null || !validTenants.contains(tenantId)) {
            throw new TenantAccessException("Invalid or missing tenant: " + tenantId);
        }
    }
}
