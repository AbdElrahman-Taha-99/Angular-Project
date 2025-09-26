# Start from official Node.js 18 image
FROM node:18-slim

# Install Chromium (headless browser for Angular/Karma tests)
RUN apt-get update && apt-get install -y chromium && rm -rf /var/lib/apt/lists/*

# Set environment variable so Karma knows where Chromium is
ENV CHROME_BIN=/usr/bin/chromium

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Set working directory
WORKDIR /usr/src/app

# # Copy only package.json + lock first (better caching)
# COPY package*.json ./

# # Install dependencies
# RUN npm ci

# # Copy rest of the app
# COPY . .

# # Default command (optional, can override in Jenkinsfile)
# CMD ["npm", "test"]
