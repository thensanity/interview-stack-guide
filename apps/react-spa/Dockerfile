# Multi-stage build for React SPA — nginx serves static assets
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/react-spa/package.json apps/react-spa/
COPY packages/ packages/
RUN npm ci -w @interview/react-spa
COPY apps/react-spa/ apps/react-spa/
RUN npm run build -w @interview/react-spa

FROM nginx:alpine
COPY --from=builder /app/apps/react-spa/dist /usr/share/nginx/html
COPY apps/react-spa/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost/ || exit 1
