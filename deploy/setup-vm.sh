#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# AdTech Platform — GCP VM Setup Script
# Run this on a fresh Ubuntu 22.04 VM (e2-standard-2, 8GB RAM)
#
# Usage:
#   curl -sSL https://raw.githubusercontent.com/YOUR_USER/YOUR_REPO/main/deploy/setup-vm.sh | bash
# ─────────────────────────────────────────────────────────────────
set -e

REPO_URL="https://github.com/YOUR_USER/YOUR_REPO.git"   # ← replace before running
APP_DIR="/opt/adtech"

echo "==> [1/5] Installing Docker..."
apt-get update -qq
apt-get install -y ca-certificates curl gnupg lsb-release git
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -qq
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "==> [2/5] Installing Docker Compose v2..."
mkdir -p /usr/local/lib/docker/cli-plugins
curl -SL "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-linux-x86_64" \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

echo "==> [3/5] Cloning repository..."
mkdir -p "$APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" pull
else
  git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

echo "==> [4/5] Setting up environment..."
# Increase VM memory limits for Kafka
sysctl -w vm.max_map_count=262144
echo "vm.max_map_count=262144" >> /etc/sysctl.conf

echo "==> [5/5] Starting all services..."
docker compose pull --quiet
docker compose up --build -d

echo ""
echo "✅  AdTech Platform is running!"
echo "─────────────────────────────────────────"
echo "   Retail Site:    http://$(curl -s ifconfig.me):3000"
echo "   Dashboard:      http://$(curl -s ifconfig.me):3001"
echo "   API Swagger:    http://$(curl -s ifconfig.me):8081/swagger-ui.html"
echo "   Kafka UI:       http://$(curl -s ifconfig.me):8090"
echo "   Grafana:        http://$(curl -s ifconfig.me):3002"
echo "─────────────────────────────────────────"
echo "   Next: run deploy/ssl-setup.sh to add HTTPS"
echo ""
