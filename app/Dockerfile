# Docker file for Node UI

FROM node:16-alpine3.11
WORKDIR /usr/app
COPY package.json .
RUN npm install --quiet
COPY . .
