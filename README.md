# AdTech Real-Time Streaming Platform

A production-grade demo of a retail media network analytics platform — similar to Amazon Ads, Walmart Connect, or Flipkart Ads.

## Architecture

```
Retail Website (retail-ui)
       ↓  Tracking SDK fires events
Event Collector API  (POST /events)
       ↓  Publishes to Kafka
Kafka Topics: ad-events | product-events | cart-events
       ↓  Consumed by
Stream Processor  →  PostgreSQL (raw events + aggregated metrics)
                          ↑
Insights API  (GET /ad/{campaignId}/clicks etc.)
       ↑
Marketing Dashboard (dashboard-ui)
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| retail-ui | 3000 | Shopping website with sponsored products |
| dashboard-ui | 3001 | Marketing analytics dashboard |
| event-collector | 8080 | Receives events, publishes to Kafka |
| insights-api | 8081 | REST APIs for campaign metrics + Swagger UI |
| kafka-ui | 8090 | Kafka topic browser |
| grafana | 3002 | System monitoring dashboard |
| prometheus | 9090 | Metrics scraping |

## Quick Start

```bash
docker compose up --build
```

Then open:
- **Retail Site**: http://localhost:3000
- **Dashboard**: http://localhost:3001
- **API Docs**: http://localhost:8081/swagger-ui.html
- **Kafka UI**: http://localhost:8090
- **Grafana**: http://localhost:3002 (admin/admin)

## Demo Flow

1. Open retail site → select tenant (Amazon / Flipkart / Walmart)
2. Browse and click a **Sponsored** product → `AD_IMPRESSION` + `AD_CLICK` fires
3. Add product to cart → `ADD_TO_CART` fires
4. Open Dashboard → watch **Impressions / Clicks / CTR / Click-to-Basket** update live
5. Open Kafka UI → see events flowing through topics
6. Call `GET /ad/{campaignId}/clicks` in Swagger UI
7. Switch tenant → dashboard shows isolated data per tenant

## Tech Stack

- **Event Ingestion**: Apache Kafka (Confluent CP 7.5)
- **Stream Processing**: Spring Boot Kafka Consumer
- **Storage**: PostgreSQL 15
- **APIs**: Spring Boot 3 + Java 17, OpenAPI/Swagger
- **Frontend**: React (CRA)
- **Monitoring**: Prometheus + Grafana
- **Deployment**: Docker Compose
