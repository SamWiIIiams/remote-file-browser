# Name the node stage "builder"
FROM node:alpine as builder
# Set working directory
WORKDIR /client
#Copy package.json
COPY ./package.json /client
#install npm dependencies
RUN npm install
# Copy all other files from current directory to working dir in image
COPY . .
# install node modules and build assets
CMD [ "npm", "run", "build" ]

# nginx state for serving content
FROM nginx:alpine

EXPOSE 3000
# Copy .conf file from here to use for nginx server
COPY /nginx/defualt.conf /etc/nginx/conf.d/default.conf
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
# Copy static assets from builder stage
COPY --from=builder /app/build .
# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]