# Use an official Nginx image as the base image
FROM nginx:alpine

# Remove the default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your static HTML file to the Nginx directory
COPY ./index.html /usr/share/nginx/html/

# Expose port 80
EXPOSE 80


# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
