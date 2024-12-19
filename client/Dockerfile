
# Step 1: Use official Node.js LTS image
FROM node:18-alpine AS builder

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Expose port 6001
EXPOSE 6001

# Step 7: Start the server
CMD ["npm", "run", "dev"]