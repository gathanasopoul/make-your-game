# Use a lightweight Nginx image to serve the static vanilla HTML/JS/CSS game
FROM nginx:alpine

# Copy static game assets into Nginx's default public web root
COPY static /usr/share/nginx/html

# Expose port 80 to access the web server
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
