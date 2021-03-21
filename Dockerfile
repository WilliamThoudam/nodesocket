FROM node:latest as node
#FROM current-alpine3.12 as node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY .env ./
RUN rm -rf node_modules
RUN npm install

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .
WORKDIR /usr/src/app

EXPOSE 5000
#CMD [ "NODE_ENV=production", "node", "server.js" ]
#CMD [ "node", "server.js" ]
