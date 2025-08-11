FROM node:20

# Install ffmpeg and ffprobe
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./
RUN npm install
COPY . .


# # Use an official Node.js runtime as a parent image
# FROM node:20

# # Set the working directory in the container
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install any needed packages specified in package.json
# RUN npm install

# # Add FFmpeg to the image
# RUN apt-get update && \
#     apt-get install -y ffmpeg && \
#     rm -rf /var/lib/apt/lists/*

# # Bundle app source inside Docker image
# COPY . .

# # Make port 3000 available to the world outside this container
# EXPOSE 3000

# # Command to run on container start
# CMD ["node", "main.js"]
