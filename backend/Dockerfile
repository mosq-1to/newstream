# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (for better layer caching)
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Compile seed script
RUN npx tsc --outDir dist/scripts scripts/seed-topics.ts

# Production stage
# Using Debian-based image instead of Alpine to ensure compatibility with ONNX Runtime and Sharp
FROM node:20-slim AS production

# Set NODE_ENV
ENV NODE_ENV=production

# Install required dependencies for ONNX Runtime and Sharp + FFmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    libc6 \
    libstdc++6 \
    ca-certificates \
    build-essential \
    python3 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package-lock.json* ./

# Install production dependencies for the target platform
RUN npm ci --only=production && \
    npm install --platform=linux --arch=arm64 sharp

# Create directory for audio storage if needed
RUN mkdir -p /tmp/hls && chmod 777 /tmp/hls

# Expose the application port
EXPOSE 3000

# Run migrations, seed database, then start the server
CMD npm run migrate:prod && npm run seed:topics && npm run start:prod