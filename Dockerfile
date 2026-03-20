# Dockerfile for Dream Studio Connect (Next.js 16 + Auth.js v5 + Prisma/Neon)
# Multi-stage build for production-ready image

# ── 1. Builder ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10 --activate

# Install native deps needed by bcryptjs + Prisma
RUN apk add --no-cache libc6-compat openssl

# Install Node dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy Prisma schema before generate
COPY prisma ./prisma

# Generate Prisma client
RUN pnpm db:generate

# Copy all source files
COPY . .

# Build args for Next.js (non-sensitive, build-time only)
ARG AUTH_URL=http://localhost:3000
ENV AUTH_URL=$AUTH_URL

# Build the Next.js app (script: prisma generate && next build)
RUN pnpm build

# ── 2. Production runner ──────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10 --activate
RUN apk add --no-cache libc6-compat openssl

ENV NODE_ENV=production

# Copy build output and runtime files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env.example ./

# Expose port
EXPOSE 3000

# Runtime env vars — à surcharger via docker-compose ou secrets
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["pnpm", "start"]
