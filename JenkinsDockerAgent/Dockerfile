FROM node:20-bullseye-slim

# Install Chromium and build tools
RUN apt-get update && apt-get install -y \
    chromium \
    git \
    curl \
    bash \
    g++ \
    make \
    unzip \
    wget \
    gnupg \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*

# Install Docker CLI
RUN curl -fsSL https://get.docker.com | sh

# -------------------------
# Security Tools
# -------------------------

# Install Trivy (latest stable)
RUN wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor > /usr/share/keyrings/trivy.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb generic main" > /etc/apt/sources.list.d/trivy.list \
    && apt-get update && apt-get install -y trivy \
    && rm -rf /var/lib/apt/lists/*

# Env vars for Angular/Karma tests
ENV CHROME_BIN=/usr/bin/chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Fix npm cache perms for Jenkins
RUN npm config set cache /tmp --global

# Install Angular CLI
RUN npm install -g @angular/cli

WORKDIR /usr/src/app
