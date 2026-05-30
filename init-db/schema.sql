-- ============================================================
-- AdTech Platform - PostgreSQL Schema
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- Raw event log — immutable, append-only source of truth
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
    event_id        UUID        DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id       VARCHAR(50)  NOT NULL,
    event_type      VARCHAR(30)  NOT NULL,   -- AD_IMPRESSION | AD_CLICK | ADD_TO_CART | PRODUCT_VIEW | PRODUCT_CLICK
    campaign_id     VARCHAR(50),
    ad_id           VARCHAR(50),
    product_id      VARCHAR(50),
    user_id         VARCHAR(100),
    session_id      VARCHAR(100),
    event_timestamp TIMESTAMPTZ  NOT NULL,
    received_at     TIMESTAMPTZ  DEFAULT NOW(),
    browser         VARCHAR(50),
    os              VARCHAR(50),
    device_type     VARCHAR(20),
    country         VARCHAR(50),
    page_url        TEXT,
    referrer        TEXT
);

CREATE INDEX idx_events_tenant_campaign   ON events (tenant_id, campaign_id);
CREATE INDEX idx_events_session           ON events (tenant_id, session_id);
CREATE INDEX idx_events_type_timestamp    ON events (event_type, event_timestamp DESC);
CREATE INDEX idx_events_tenant_timestamp  ON events (tenant_id, event_timestamp DESC);

-- ------------------------------------------------------------
-- Pre-aggregated metrics — what Insights API reads from
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS campaign_metrics (
    tenant_id       VARCHAR(50)   NOT NULL,
    campaign_id     VARCHAR(50)   NOT NULL,
    metric_date     DATE          NOT NULL,
    impressions     BIGINT        NOT NULL DEFAULT 0,
    clicks          BIGINT        NOT NULL DEFAULT 0,
    add_to_cart     BIGINT        NOT NULL DEFAULT 0,
    -- derived: recomputed on every upsert
    ctr             DECIMAL(10,4) NOT NULL DEFAULT 0,   -- clicks / impressions
    click_to_basket DECIMAL(10,4) NOT NULL DEFAULT 0,   -- add_to_cart / clicks
    updated_at      TIMESTAMPTZ   DEFAULT NOW(),
    PRIMARY KEY (tenant_id, campaign_id, metric_date)
);

CREATE INDEX idx_metrics_tenant_campaign  ON campaign_metrics (tenant_id, campaign_id);
CREATE INDEX idx_metrics_date             ON campaign_metrics (metric_date DESC);

-- ------------------------------------------------------------
-- Seed data — tenants and campaigns for demo
-- ------------------------------------------------------------
INSERT INTO campaign_metrics (tenant_id, campaign_id, metric_date, impressions, clicks, add_to_cart, ctr, click_to_basket)
VALUES
    ('amazon',   'camp-amz-001', CURRENT_DATE, 0, 0, 0, 0, 0),
    ('amazon',   'camp-amz-002', CURRENT_DATE, 0, 0, 0, 0, 0),
    ('flipkart', 'camp-fk-001',  CURRENT_DATE, 0, 0, 0, 0, 0),
    ('flipkart', 'camp-fk-002',  CURRENT_DATE, 0, 0, 0, 0, 0),
    ('walmart',  'camp-wm-001',  CURRENT_DATE, 0, 0, 0, 0, 0),
    ('walmart',  'camp-wm-002',  CURRENT_DATE, 0, 0, 0, 0, 0)
ON CONFLICT DO NOTHING;
