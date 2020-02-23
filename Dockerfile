FROM node:lts-alpine as build-stage
RUN mkdir /oasis-admin-client
WORKDIR /oasis-admin-client
COPY package.json .
RUN npm install
COPY . .

# All of these below are for production mode, comment all of them while using for development mode
# RUN npm run build
