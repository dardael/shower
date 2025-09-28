# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Install git for lint-staged
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Change ownership of the app directory to node user
RUN chown -R node:node /app

# Copy package files
COPY package*.json ./

# Install dependencies as root first
RUN npm ci

# Change ownership after npm install
RUN chown -R node:node /app

# Switch to the node user (UID/GID 1000:1000)
USER node

# Copy the rest of the application code
COPY --chown=node:node . .

# Expose port 3000
EXPOSE 3000

# Default command for development
CMD ["npm", "run", "dev"]
