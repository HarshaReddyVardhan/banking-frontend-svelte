# --- Stage 1: Build Stage ---
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Ensure we are in development mode during build to install devDependencies
ENV NODE_ENV=development

# Copy package files first for better layer caching
# We copy package-lock.json to ensure consistent builds
COPY package*.json ./

# Install ALL dependencies (including devDependencies needed for build)
# Using 'npm ci' for reproducible builds in CI/CD environments
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the SvelteKit application
# This generates the standalone Node.js server in the /build directory
RUN npm run build

# Prune development dependencies to keep the production image lean
RUN npm prune --production


# --- Stage 2: Production Stage ---
FROM node:20-alpine AS runner

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=3000
# SvelteKit specific: ensure it listens on all interfaces inside the container
ENV BODY_SIZE_LIMIT=0 

# Set working directory
WORKDIR /app

# Create a dedicated non-root user and group for the application
# Security: Never run your application as root in a container
RUN addgroup -g 1001 -S nodejs && \
    adduser -S sveltejs -u 1001 -G nodejs

# Copy only the necessary artifacts from the builder stage
# /build: Contains the compiled server and client assets
# /node_modules: Contains only production dependencies
# package.json: Needed for some runtime metadata
COPY --from=builder --chown=sveltejs:nodejs /app/build ./build
COPY --from=builder --chown=sveltejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=sveltejs:nodejs /app/package.json ./package.json

# Switch to the non-root user
USER sveltejs

# Expose the application port
EXPOSE 3000

# Health check to ensure the container is running and responding
# wget is available in alpine and less heavy than curl
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

# Start the SvelteKit application using the built entry point
CMD ["node", "build/index.js"]
