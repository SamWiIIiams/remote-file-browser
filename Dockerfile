# Name the node stage "builder"
FROM node:alpine as client
# Set working directory
WORKDIR /usr/app/client
#Copy package.json
COPY ./client/package.json ./
#install npm dependencies
RUN npm install
# Copy all necessary files from current directory to working dir in image
COPY ./client/src ./src
COPY ./client/public ./public
# install node modules and build assets
RUN npm run build

FROM node:alpine as server
#Set working directory
WORKDIR /usr/app/server
#Copy static react build to server directory
COPY --from=client /usr/app/client/build/ ./build
#cCopy necessary server files
COPY ./server/root ./root
COPY ./server/package.json ./
#Install npm dependencies
RUN npm install
#Copy .js files to container
COPY ./server/server.js ./
COPY ./server/helper.js ./
#Set server to listen on 5000
ENV PORT=5000
#Serve on port 5000
EXPOSE 5000
#Start the server
CMD ["node", "server.js"]