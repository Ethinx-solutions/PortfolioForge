FROM node:20-slim

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./
RUN npm install --production

# Copy source
COPY . .

# Cloud Run uses PORT env var
ENV PORT=3000
EXPOSE 3000

# Run API server + worker
CMD ["npm", "start"]
