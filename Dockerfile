# Etapa de build (Angular)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Fuerza salida a una carpeta fija (dist/app) para simplificar el COPY siguiente
RUN npm run build -- --configuration=production --base-href=/

# Etapa de runtime (Nginx)
FROM nginx:1.27-alpine

# Generar certificados SSL autofirmados
RUN apk add --no-cache openssl && \
    mkdir -p /etc/ssl/nginx && \
    openssl req -x509 -nodes -days 365 \
        -newkey rsa:2048 \
        -keyout /etc/ssl/nginx/privkey.pem \
        -out /etc/ssl/nginx/fullchain.pem \
        -subj "/C=AR/ST=San Salvador de Jujuy/L=SSJ/O=Ferreteria Ficticia/CN=Ferreteria"

# Variables para templating
ENV BACKEND_HOST=ferre-backend
ENV BACKEND_PORT=8080

# Build de Angular → Nginx html
COPY --from=build /app/dist/*/browser/ /usr/share/nginx/html/

# Template + entrypoint con envsubst
COPY docker/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 443

# ✔ Healthcheck HTTPS
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-check-certificate -qO- https://localhost/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]