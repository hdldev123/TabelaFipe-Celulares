# Dockerfile para o servidor
FROM node:18-alpine

WORKDIR /app

# Copiar package.json do servidor
COPY servidor/package*.json ./
RUN npm ci --only=production

# Copiar código do servidor
COPY servidor/ ./

# Instalar dependências do Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Configurar Puppeteer para usar chromium instalado
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

EXPOSE 5001

CMD ["npm", "start"]