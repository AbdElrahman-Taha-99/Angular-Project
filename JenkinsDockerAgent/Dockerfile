# Use Node 18
FROM node:18-bullseye-slim

# Install Chromium and build tools
RUN apt-get update && apt-get install -y \
    chromium \
    git \
    curl \
    bash \
    g++ \
    make \
    && rm -rf /var/lib/apt/lists/*

# Set environment variable so Karma knows where Chromium is
ENV CHROME_BIN=/usr/bin/chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Install Angular CLI and npm (Node 18 compatible)
RUN npm install -g npm@10 @angular/cli

# Set working directory
WORKDIR /usr/src/app