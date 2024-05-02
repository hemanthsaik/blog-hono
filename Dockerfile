# Use the official Node.js 14 image as a base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json .

# Install NestJS dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# command to run the application
CMD ["npm", "run", "start"]