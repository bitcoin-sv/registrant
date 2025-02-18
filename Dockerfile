# Use Node.js as the build stage
FROM node:18 AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the app and build
COPY . .
RUN npm run build

# Use Nginx for serving the static site
FROM nginx:alpine

# Change Nginx default port to 8080
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the correct port
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
