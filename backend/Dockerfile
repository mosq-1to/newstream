# Build stage
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ENV DATABASE_URL="postgresql://newstream:newstream@dev-db:5432/newstream?schema=public"
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"] 