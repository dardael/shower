# Use Node.js 20 as base image
FROM node:24

# Install git
RUN apt-get update && apt-get install -y git
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

# Copy the rest of the application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Default command for development
CMD ["npm", "run", "dev"]
