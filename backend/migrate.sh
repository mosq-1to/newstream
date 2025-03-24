#!/bin/bash

# This script runs Prisma migrations in the Docker container

echo "Running Prisma migrations..."
docker compose exec backend npx prisma migrate dev --name init

echo "Migration complete. Now restarting the backend service..."
docker compose restart backend 