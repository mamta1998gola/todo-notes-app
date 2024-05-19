# Stage 1: Build the Node.js app
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the app (assuming there's a build script in package.json)
RUN npm run build

# Stage 2: Serve static files with Nginx
# FROM nginx:alpine

# Copy the build output to Nginx's static files directory
# COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx configuration file
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to the outside world
EXPOSE 5173

# Start Nginx
# CMD ["nginx", "-g", "daemon off;"]
CMD ["npm", "run", "dev"]
