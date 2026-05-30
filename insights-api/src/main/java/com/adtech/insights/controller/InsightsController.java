package com.adtech.insights.controller;

import com.adtech.insights.model.ApiResponse;
import com.adtech.insights.model.BreakdownItem;
import com.adtech.insights.model.CampaignMetrics;
import com.adtech.insights.service.InsightsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@Tag(name = "Ad Insights", description = "Real-time and historical campaign performance metrics")
public class InsightsController {

    private final InsightsService insightsService;

    public InsightsController(InsightsService insightsService) {
        this.insightsService = insightsService;
    }

    // ── Mandatory endpoints ───────────────────────────────────────────────────

    @GetMapping("/ad/{campaignId}/clicks")
    @Operation(summary = "Get total clicks", description = "Returns the number of customers who clicked on the ad")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getClicks(
            @PathVariable String campaignId,
            @Parameter(description = "Tenant identifier", required = true, example = "amazon")
            @RequestHeader("X-Tenant-ID") String tenantId) {

        long clicks = insightsService.getClicks(tenantId, campaignId);
        return ResponseEntity.ok(ApiResponse.of(
                Map.of("campaignId", campaignId, "clicks", clicks),
                tenantId
        ));
    }

    @GetMapping("/ad/{campaignId}/impressions")
    @Operation(summary = "Get total impressions", description = "Returns the number of customers who viewed the ad")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getImpressions(
            @PathVariable String campaignId,
            @RequestHeader("X-Tenant-ID") String tenantId) {

        long impressions = insightsService.getImpressions(tenantId, campaignId);
        return ResponseEntity.ok(ApiResponse.of(
                Map.of("campaignId", campaignId, "impressions", impressions),
                tenantId
        ));
    }

    @GetMapping("/ad/{campaignId}/clickToBasket")
    @Operation(summary = "Get click-to-basket rate",
               description = "Returns the rate of customers who added a product to cart after clicking the ad")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getClickToBasket(
            @PathVariable String campaignId,
            @RequestHeader("X-Tenant-ID") String tenantId) {

        double ctb = insightsService.getClickToBasket(tenantId, campaignId);
        return ResponseEntity.ok(ApiResponse.of(
                Map.of("campaignId", campaignId, "clickToBasket", ctb),
                tenantId
        ));
    }

    // ── Bonus endpoints ───────────────────────────────────────────────────────

    @GetMapping("/campaign/{campaignId}/ctr")
    @Operation(summary = "Get click-through rate", description = "Returns CTR = clicks / impressions")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCtr(
            @PathVariable String campaignId,
            @RequestHeader("X-Tenant-ID") String tenantId) {

        double ctr = insightsService.getCtr(tenantId, campaignId);
        return ResponseEntity.ok(ApiResponse.of(
                Map.of("campaignId", campaignId, "ctr", ctr),
                tenantId
        ));
    }

    @GetMapping("/campaign/{campaignId}/metrics")
    @Operation(summary = "Get full campaign metrics", description = "Returns all KPIs for a campaign in one call")
    public ResponseEntity<ApiResponse<CampaignMetrics>> getFullMetrics(
            @PathVariable String campaignId,
            @RequestHeader("X-Tenant-ID") String tenantId) {

        CampaignMetrics metrics = insightsService.getFullMetrics(tenantId, campaignId);
        return ResponseEntity.ok(ApiResponse.of(metrics, tenantId));
    }

    @GetMapping("/campaign/{campaignId}/browser-breakdown")
    @Operation(summary = "Browser distribution", description = "Returns impression count grouped by browser")
    public ResponseEntity<ApiResponse<List<BreakdownItem>>> getBrowserBreakdown(
            @PathVariable String campaignId,
            @RequestHeader("X-Tenant-ID") String tenantId) {

        List<BreakdownItem> breakdown = insightsService.getBrowserBreakdown(tenantId, campaignId);
        return ResponseEntity.ok(ApiResponse.of(breakdown, tenantId));
    }

    @GetMapping("/campaign/{campaignId}/country-breakdown")
    @Operation(summary = "Country distribution", description = "Returns impression count grouped by country")
    public ResponseEntity<ApiResponse<List<BreakdownItem>>> getCountryBreakdown(
            @PathVariable String campaignId,
            @RequestHeader("X-Tenant-ID") String tenantId) {

        List<BreakdownItem> breakdown = insightsService.getCountryBreakdown(tenantId, campaignId);
        return ResponseEntity.ok(ApiResponse.of(breakdown, tenantId));
    }

    @GetMapping("/campaign/{campaignId}/daily")
    @Operation(summary = "Daily metrics time-series", description = "Returns per-day metrics for the last N days (default 7)")
    public ResponseEntity<ApiResponse<List<CampaignMetrics>>> getDailyMetrics(
            @PathVariable String campaignId,
            @RequestParam(defaultValue = "7") int days,
            @RequestHeader("X-Tenant-ID") String tenantId) {

        List<CampaignMetrics> daily = insightsService.getDailyMetrics(tenantId, campaignId, days);
        return ResponseEntity.ok(ApiResponse.of(daily, tenantId));
    }

    @GetMapping("/tenant/campaigns")
    @Operation(summary = "List all campaigns for a tenant")
    public ResponseEntity<ApiResponse<List<CampaignMetrics>>> getAllCampaigns(
            @RequestHeader("X-Tenant-ID") String tenantId) {

        List<CampaignMetrics> campaigns = insightsService.getAllCampaigns(tenantId);
        return ResponseEntity.ok(ApiResponse.of(campaigns, tenantId));
    }
}
