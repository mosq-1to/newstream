# Multi-stage build for optimized production image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ gcc

# Install dependencies first (for better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Set NODE_ENV
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Create directory for audio storage if needed
RUN mkdir -p /tmp/hls && chmod 777 /tmp/hls

# Expose the application port
EXPOSE 3000

# Start the server using production command
CMD ["npm", "run", "start:prod"]
