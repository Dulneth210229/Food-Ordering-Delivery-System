# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port (same as your Express server)
EXPOSE 5000

# Start the app
CMD ["node", "app.js"]
