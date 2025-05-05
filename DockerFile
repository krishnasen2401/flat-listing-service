# Dockerfile
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose app port (adjust if different)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
