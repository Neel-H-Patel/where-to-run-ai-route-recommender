# use Node.js for building frontend
FROM node:22-alpine AS builder

# set working dir
WORKDIR /app

# copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# copy rest of frontend files
COPY . .

## build Next.js app
#RUN npm run build

# serve using a minimal server
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app ./

# expose the port Next.js runs on
EXPOSE 8080

# start Next.js in dev mode
CMD ["npm", "run", "dev"]