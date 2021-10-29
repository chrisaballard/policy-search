FROM node:16-alpine3.11
WORKDIR /usr/app

COPY . ./

RUN npm install -g http-server@14.0.0
CMD http-server . --port 8002

EXPOSE 8002