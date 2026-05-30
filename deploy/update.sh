#!/bin/bash
# Pull latest code and restart services with zero-downtime
set -e
cd /opt/adtech
git pull
docker compose up --build -d
docker compose ps
echo "✅  Update complete"
