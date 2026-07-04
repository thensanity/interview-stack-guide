FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/db/package.json ./packages/db/
COPY packages/events/package.json ./packages/events/
COPY packages/graphql/package.json ./packages/graphql/
COPY apps/api/package.json ./apps/api/
RUN npm ci --workspace=@interview/api --include-workspace-root
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/
RUN npm run build -w @interview/db && npm run build -w @interview/events && npm run build -w @interview/graphql && npm run build -w @interview/api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:4000/health || exit 1
CMD ["node", "apps/api/dist/index.js"]
