# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy only production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
# Copy application source
COPY . .

# Use non-root user
USER node

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/healthz || exit 1

CMD ["npm", "start"]
