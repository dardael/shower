# Use Node.js 20 as base image
FROM node:24

# Install git and Playwright dependencies for lint-staged
RUN apt-get update && apt-get install -y git libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2 libgtk-4-1 libwebkit2gtk-4.0-37 && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Change ownership to node user
RUN chown -R node:node /app

# Switch to the node user (UID/GID 1000:1000)
USER node

# Install Playwright browsers
RUN npx playwright install
RUN npx playwright install

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Default command for development
CMD ["npm", "run", "dev"]
