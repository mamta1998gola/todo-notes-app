# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Command to run the app
CMD ["npm", "start"]
