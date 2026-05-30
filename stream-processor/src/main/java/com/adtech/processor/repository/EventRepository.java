package com.adtech.processor.repository;

import com.adtech.processor.model.AdEvent;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

@Repository
public class EventRepository {

    private final JdbcTemplate jdbc;

    public EventRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void insertRawEvent(AdEvent event) {
        jdbc.update("""
            INSERT INTO events (
                event_id, tenant_id, event_type, campaign_id, ad_id, product_id,
                user_id, session_id, event_timestamp, browser, os, device_type,
                country, page_url, referrer
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT (event_id) DO NOTHING
            """,
            event.getEventId(),
            event.getTenantId(),
            event.getEventType(),
            event.getCampaignId(),
            event.getAdId(),
            event.getProductId(),
            event.getUserId(),
            event.getSessionId(),
            parseTimestamp(event.getTimestamp()),
            event.getBrowser(),
            event.getOs(),
            event.getDeviceType(),
            event.getCountry(),
            event.getPageUrl(),
            event.getReferrer()
        );
    }

    public void upsertImpressions(String tenantId, String campaignId) {
        upsertMetric(tenantId, campaignId, "impressions");
    }

    public void upsertClicks(String tenantId, String campaignId) {
        upsertMetric(tenantId, campaignId, "clicks");
    }

    public void upsertAddToCart(String tenantId, String campaignId) {
        upsertMetric(tenantId, campaignId, "add_to_cart");
    }

    // Finds the most recent AD_CLICK for a session within the attribution window
    public Optional<String> findCampaignIdForRecentClick(String tenantId, String sessionId, int windowMinutes) {
        var results = jdbc.queryForList("""
            SELECT campaign_id FROM events
            WHERE tenant_id = ?
              AND session_id = ?
              AND event_type = 'AD_CLICK'
              AND event_timestamp >= NOW() - INTERVAL '%d minutes'
            ORDER BY event_timestamp DESC
            LIMIT 1
            """.formatted(windowMinutes),
            String.class,
            tenantId, sessionId
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    private void upsertMetric(String tenantId, String campaignId, String column) {
        jdbc.update("""
            INSERT INTO campaign_metrics (tenant_id, campaign_id, metric_date, %s, ctr, click_to_basket)
            VALUES (?, ?, CURRENT_DATE, 1, 0, 0)
            ON CONFLICT (tenant_id, campaign_id, metric_date) DO UPDATE
              SET %s         = campaign_metrics.%s + 1,
                  ctr             = CASE
                                      WHEN (campaign_metrics.impressions + CASE WHEN '%s' = 'impressions' THEN 1 ELSE 0 END) = 0 THEN 0
                                      ELSE ROUND(
                                        CAST(campaign_metrics.clicks + CASE WHEN '%s' = 'clicks' THEN 1 ELSE 0 END AS DECIMAL) /
                                        CAST(campaign_metrics.impressions + CASE WHEN '%s' = 'impressions' THEN 1 ELSE 0 END AS DECIMAL), 4)
                                    END,
                  click_to_basket = CASE
                                      WHEN (campaign_metrics.clicks + CASE WHEN '%s' = 'clicks' THEN 1 ELSE 0 END) = 0 THEN 0
                                      ELSE ROUND(
                                        CAST(campaign_metrics.add_to_cart + CASE WHEN '%s' = 'add_to_cart' THEN 1 ELSE 0 END AS DECIMAL) /
                                        CAST(campaign_metrics.clicks + CASE WHEN '%s' = 'clicks' THEN 1 ELSE 0 END AS DECIMAL), 4)
                                    END,
                  updated_at      = NOW()
            """.formatted(column, column, column, column, column, column, column, column, column),
            tenantId, campaignId
        );
    }

    private Timestamp parseTimestamp(String ts) {
        try {
            return ts != null ? Timestamp.from(Instant.parse(ts)) : Timestamp.from(Instant.now());
        } catch (Exception e) {
            return Timestamp.from(Instant.now());
        }
    }
}
