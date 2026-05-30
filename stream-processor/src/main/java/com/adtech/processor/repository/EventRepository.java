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
            ) VALUES (CAST(? AS UUID), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        jdbc.update("""
            INSERT INTO campaign_metrics (tenant_id, campaign_id, metric_date, impressions, clicks, add_to_cart, ctr, click_to_basket)
            VALUES (?, ?, CURRENT_DATE, 1, 0, 0, 0, 0)
            ON CONFLICT (tenant_id, campaign_id, metric_date) DO UPDATE
              SET impressions = campaign_metrics.impressions + 1,
                  ctr         = CASE WHEN (campaign_metrics.impressions + 1) = 0 THEN 0
                                     ELSE ROUND(CAST(campaign_metrics.clicks AS DECIMAL) / (campaign_metrics.impressions + 1), 4) END,
                  updated_at  = NOW()
            """, tenantId, campaignId);
    }

    public void upsertClicks(String tenantId, String campaignId) {
        jdbc.update("""
            INSERT INTO campaign_metrics (tenant_id, campaign_id, metric_date, impressions, clicks, add_to_cart, ctr, click_to_basket)
            VALUES (?, ?, CURRENT_DATE, 0, 1, 0, 0, 0)
            ON CONFLICT (tenant_id, campaign_id, metric_date) DO UPDATE
              SET clicks      = campaign_metrics.clicks + 1,
                  ctr         = CASE WHEN campaign_metrics.impressions = 0 THEN 0
                                     ELSE ROUND(CAST((campaign_metrics.clicks + 1) AS DECIMAL) / campaign_metrics.impressions, 4) END,
                  updated_at  = NOW()
            """, tenantId, campaignId);
    }

    public void upsertAddToCart(String tenantId, String campaignId) {
        jdbc.update("""
            INSERT INTO campaign_metrics (tenant_id, campaign_id, metric_date, impressions, clicks, add_to_cart, ctr, click_to_basket)
            VALUES (?, ?, CURRENT_DATE, 0, 0, 1, 0, 0)
            ON CONFLICT (tenant_id, campaign_id, metric_date) DO UPDATE
              SET add_to_cart     = campaign_metrics.add_to_cart + 1,
                  click_to_basket = CASE WHEN campaign_metrics.clicks = 0 THEN 0
                                         ELSE ROUND(CAST((campaign_metrics.add_to_cart + 1) AS DECIMAL) / campaign_metrics.clicks, 4) END,
                  updated_at      = NOW()
            """, tenantId, campaignId);
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

    private Timestamp parseTimestamp(String ts) {
        try {
            return ts != null ? Timestamp.from(Instant.parse(ts)) : Timestamp.from(Instant.now());
        } catch (Exception e) {
            return Timestamp.from(Instant.now());
        }
    }
}
