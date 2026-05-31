# AdTech Real-Time Streaming Platform

A real-time analytics platform for a Retail Media Network — similar to Amazon Ads, Walmart Connect, or Flipkart Ads.

---

## Live Demo

| | URL |
|---|---|
| 🛍️ Retail Site | https://shop.shubhamnayak.online |
| 📊 Marketing Dashboard | https://dashboard.shubhamnayak.online |
| 📖 API Docs (Swagger) | https://api.shubhamnayak.online/swagger-ui.html |
| 🐦 Kafka UI | https://kafka.shubhamnayak.online |
| 📈 Grafana | https://grafana.shubhamnayak.online |

---

## Running Locally

**Prerequisites:** Docker Desktop

```bash
git clone https://github.com/shubhamNayak1/interviewcasestudy.git
cd interviewcasestudy
docker compose up --build
```

Wait ~60 seconds for all services to start, then open:

| Service | URL |
|---|---|
| Retail Site | http://localhost:3000 |
| Marketing Dashboard | http://localhost:3001 |
| API Swagger UI | http://localhost:8081/swagger-ui.html |
| Kafka UI | http://localhost:8090 |
| Grafana | http://localhost:3002 &nbsp;*(admin / admin)* |

---

## Services

| Service | Description |
|---|---|
| `event-collector` | Receives browser events and publishes them to Kafka |
| `stream-processor` | Consumes Kafka events, writes to PostgreSQL, handles attribution |
| `insights-api` | REST API for campaign metrics |
| `retail-ui` | Shopping website with ad tracking |
| `dashboard-ui` | Marketing analytics dashboard |
| `postgres` | Stores raw events and aggregated campaign metrics |
| `kafka` | Event streaming backbone |
| `prometheus` | Metrics collection |
| `grafana` | Monitoring dashboards and alerts |

---

## Deployment

### Local
```bash
docker compose up --build
```

### Production (GCP)
Deployed on a GCP `e2-standard-2` VM (Ubuntu 22.04) with Docker Compose and nginx as a reverse proxy with Let's Encrypt SSL.

To deploy on a fresh VM:
```bash
curl -sSL https://raw.githubusercontent.com/shubhamNayak1/interviewcasestudy/main/deploy/setup-vm.sh | bash
```

---

## Tenants

The platform supports three demo tenants. Select one in the retail site or dashboard header, or pass the header in API calls:

```bash
curl -H "X-Tenant-ID: amazon"   https://api.shubhamnayak.online/tenant/campaigns
curl -H "X-Tenant-ID: flipkart" https://api.shubhamnayak.online/tenant/campaigns
curl -H "X-Tenant-ID: walmart"  https://api.shubhamnayak.online/tenant/campaigns
```
