# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies for building
RUN npm ci

# Copy all project files
COPY . .

# Set build-time environment variables
ARG AIRTABLE_API_KEY
ARG AIRTABLE_BASE_ID
ENV AIRTABLE_API_KEY=$AIRTABLE_API_KEY
ENV AIRTABLE_BASE_ID=$AIRTABLE_BASE_ID

# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]