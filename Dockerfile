# Node.js com imagem slim
FROM node:22-slim

# Instala dependências do sistema (para skia-canvas e Chromium)
RUN apt-get update && apt-get install -y --no-install-recommends \
  libfontconfig1 \
  build-essential \
  pkg-config \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev \
  chromium \
  chromium-l10n \
  libnss3 \
  libatk-bridge2.0-0 \
  libx11-xcb1 \
  libxcb-dri3-0 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libgbm1 \
  libasound2 \
  libpangocairo-1.0-0 \
  libatk1.0-0 \
  libcups2 \
  libgtk-3-0 \
  && rm -rf /var/lib/apt/lists/*

# Instala pnpm
RUN npm install -g pnpm

# Copia os arquivos da aplicação
COPY . /app

# Define o diretório de trabalho
WORKDIR /app

# Instala dependências com pnpm
RUN pnpm install

# Prisma generate
RUN pnpm generate

# Build da aplicação
RUN pnpm build

# Instala o Chrome para o Puppeteer
RUN pnpm puppeteer browsers install chrome

# Expõe a porta da aplicação
EXPOSE 8080

# Inicia o aplicativo
CMD ["pnpm", "start"]
