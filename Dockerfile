# Use Node.js 20 as base image
FROM node:24

# Install git and mongodb-database-tools (for mongodump/mongorestore)
RUN apt-get update && apt-get install -y git gnupg curl && \
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list && \
    apt-get update && apt-get install -y mongodb-database-tools && \
    apt-get clean && rm -rf /var/lib/apt/lists/*
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
