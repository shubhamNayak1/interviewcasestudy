package com.adtech.insights.repository;

import com.adtech.insights.model.BreakdownItem;
import com.adtech.insights.model.CampaignMetrics;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class MetricsRepository {

    private final JdbcTemplate jdbc;

    public MetricsRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    // Aggregate metrics across all dates for a campaign
    public Optional<CampaignMetrics> findByCampaign(String tenantId, String campaignId) {
        var results = jdbc.query("""
            SELECT
                tenant_id,
                campaign_id,
                SUM(impressions)  AS impressions,
                SUM(clicks)       AS clicks,
                SUM(add_to_cart)  AS add_to_cart,
                CASE WHEN SUM(impressions) = 0 THEN 0
                     ELSE ROUND(CAST(SUM(clicks) AS DECIMAL) / SUM(impressions), 4) END AS ctr,
                CASE WHEN SUM(clicks) = 0 THEN 0
                     ELSE ROUND(CAST(SUM(add_to_cart) AS DECIMAL) / SUM(clicks), 4) END AS click_to_basket
            FROM campaign_metrics
            WHERE tenant_id = ? AND campaign_id = ?
            GROUP BY tenant_id, campaign_id
            """,
            (rs, i) -> CampaignMetrics.builder()
                    .tenantId(rs.getString("tenant_id"))
                    .campaignId(rs.getString("campaign_id"))
                    .impressions(rs.getLong("impressions"))
                    .clicks(rs.getLong("clicks"))
                    .addToCart(rs.getLong("add_to_cart"))
                    .ctr(rs.getDouble("ctr"))
                    .clickToBasket(rs.getDouble("click_to_basket"))
                    .build(),
            tenantId, campaignId
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    // All campaigns for a tenant
    public List<CampaignMetrics> findAllByTenant(String tenantId) {
        return jdbc.query("""
            SELECT
                tenant_id, campaign_id,
                SUM(impressions) AS impressions,
                SUM(clicks)      AS clicks,
                SUM(add_to_cart) AS add_to_cart,
                CASE WHEN SUM(impressions) = 0 THEN 0
                     ELSE ROUND(CAST(SUM(clicks) AS DECIMAL) / SUM(impressions), 4) END AS ctr,
                CASE WHEN SUM(clicks) = 0 THEN 0
                     ELSE ROUND(CAST(SUM(add_to_cart) AS DECIMAL) / SUM(clicks), 4) END AS click_to_basket
            FROM campaign_metrics
            WHERE tenant_id = ?
            GROUP BY tenant_id, campaign_id
            ORDER BY impressions DESC
            """,
            (rs, i) -> CampaignMetrics.builder()
                    .tenantId(rs.getString("tenant_id"))
                    .campaignId(rs.getString("campaign_id"))
                    .impressions(rs.getLong("impressions"))
                    .clicks(rs.getLong("clicks"))
                    .addToCart(rs.getLong("add_to_cart"))
                    .ctr(rs.getDouble("ctr"))
                    .clickToBasket(rs.getDouble("click_to_basket"))
                    .build(),
            tenantId
        );
    }

    // Daily time-series for a campaign (for the line chart)
    public List<CampaignMetrics> findDailyMetrics(String tenantId, String campaignId, int days) {
        return jdbc.query("""
            SELECT tenant_id, campaign_id, metric_date::TEXT AS date,
                   impressions, clicks, add_to_cart, ctr, click_to_basket
            FROM campaign_metrics
            WHERE tenant_id = ? AND campaign_id = ?
              AND metric_date >= CURRENT_DATE - INTERVAL '%d days'
            ORDER BY metric_date ASC
            """.formatted(days),
            (rs, i) -> CampaignMetrics.builder()
                    .tenantId(rs.getString("tenant_id"))
                    .campaignId(rs.getString("campaign_id"))
                    .date(rs.getString("date"))
                    .impressions(rs.getLong("impressions"))
                    .clicks(rs.getLong("clicks"))
                    .addToCart(rs.getLong("add_to_cart"))
                    .ctr(rs.getDouble("ctr"))
                    .clickToBasket(rs.getDouble("click_to_basket"))
                    .build(),
            tenantId, campaignId
        );
    }

    // Browser breakdown from raw events
    public List<BreakdownItem> findBrowserBreakdown(String tenantId, String campaignId) {
        return breakdown(tenantId, campaignId, "browser");
    }

    // Country breakdown from raw events
    public List<BreakdownItem> findCountryBreakdown(String tenantId, String campaignId) {
        return breakdown(tenantId, campaignId, "country");
    }

    private List<BreakdownItem> breakdown(String tenantId, String campaignId, String dimension) {
        return jdbc.query("""
            WITH totals AS (
                SELECT COUNT(*) AS total FROM events
                WHERE tenant_id = ? AND campaign_id = ? AND event_type = 'AD_IMPRESSION'
            )
            SELECT
                COALESCE(%s, 'Unknown') AS label,
                COUNT(*) AS count,
                CASE WHEN (SELECT total FROM totals) = 0 THEN 0
                     ELSE ROUND(COUNT(*) * 100.0 / (SELECT total FROM totals), 1) END AS percentage
            FROM events
            WHERE tenant_id = ? AND campaign_id = ? AND event_type = 'AD_IMPRESSION'
            GROUP BY %s
            ORDER BY count DESC
            LIMIT 10
            """.formatted(dimension, dimension),
            (rs, i) -> new BreakdownItem(
                    rs.getString("label"),
                    rs.getLong("count"),
                    rs.getDouble("percentage")
            ),
            tenantId, campaignId, tenantId, campaignId
        );
    }
}
