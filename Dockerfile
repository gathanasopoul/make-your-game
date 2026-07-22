# Use a lightweight Nginx image to serve the static vanilla HTML/JS/CSS game
FROM nginx:alpine

# Copy all static assets into Nginx's default public directory
COPY . /usr/share/nginx/html

# Expose port 80 to access the web server
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
