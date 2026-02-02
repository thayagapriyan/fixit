# ================================
# Stage 1: Build
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files for monorepo
COPY package.json package-lock.json turbo.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared-types/package.json ./packages/shared-types/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/frontend ./apps/frontend
COPY packages/shared-types ./packages/shared-types

# Build shared-types first (dependency)
WORKDIR /app/packages/shared-types
RUN npm run build

# Build frontend
WORKDIR /app/apps/frontend

# Build-time environment variables (embedded in JS bundle)
ARG VITE_API_BASE_URL
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Increase Node.js memory limit to prevent esbuild EPIPE errors
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN npm run build

# ================================
# Stage 2: Production
# ================================
FROM nginx:alpine AS production

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# Create non-root user for security
RUN adduser -D -g '' nginxuser && \
  chown -R nginxuser:nginxuser /usr/share/nginx/html && \
  chown -R nginxuser:nginxuser /var/cache/nginx && \
  chown -R nginxuser:nginxuser /var/log/nginx && \
  touch /var/run/nginx.pid && \
  chown -R nginxuser:nginxuser /var/run/nginx.pid

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
