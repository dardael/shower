# Base image for the application
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]