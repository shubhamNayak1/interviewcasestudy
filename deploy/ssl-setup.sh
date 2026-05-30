#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# AdTech Platform — SSL Setup with Let's Encrypt
# Run AFTER setup-vm.sh and after DNS A records are pointing to this VM
#
# Usage:
#   bash deploy/ssl-setup.sh yourdomain.dev your@email.com
# ─────────────────────────────────────────────────────────────────
set -e

DOMAIN=${1?"Usage: $0 <domain> <email>  e.g.  $0 adtech-demo.dev admin@example.com"}
EMAIL=${2?"Usage: $0 <domain> <email>"}

echo "==> Installing Certbot..."
apt-get install -y certbot python3-certbot-nginx

echo "==> Requesting certificates for all subdomains of $DOMAIN..."
certbot --nginx \
  --non-interactive \
  --agree-tos \
  --email "$EMAIL" \
  --domains "shop.$DOMAIN,dashboard.$DOMAIN,api.$DOMAIN,collector.$DOMAIN,kafka.$DOMAIN,grafana.$DOMAIN"

echo "==> Setting up auto-renewal..."
systemctl enable certbot.timer
systemctl start certbot.timer

echo ""
echo "✅  HTTPS enabled!"
echo "──────────────────────────────────────────────────"
echo "   Retail Site:    https://shop.$DOMAIN"
echo "   Dashboard:      https://dashboard.$DOMAIN"
echo "   API Swagger:    https://api.$DOMAIN/swagger-ui.html"
echo "   Kafka UI:       https://kafka.$DOMAIN"
echo "   Grafana:        https://grafana.$DOMAIN"
echo "──────────────────────────────────────────────────"
