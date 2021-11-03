# Docker file for Node UI

FROM node:16-alpine3.11

ENV PORT 3001

# Create the directory on the node image
# where our Next.js app will live
RUN mkdir -p /usr/app

# Set /usr/app as the working directory
WORKDIR /usr/app

# Copy package.json and package-lock.json
# to the /app working directory
COPY package*.json /usr/app/

# Install dependencies in /usr/app
RUN npm install

# Copy the rest of our Next.js folder into /usr/app
COPY . /usr/app

# Ensure port 3001 is accessible to our system
EXPOSE 3001

# Run yarn dev, as we would via the command line
CMD "npm" "run" "dev"