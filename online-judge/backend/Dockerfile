# Alpine is light weight version of node:18, will remove unnecessary stuff
FROM node:18-alpine

# Working directory of container, work in folder named app
# Never use only /
WORKDIR /app

RUN apk update && apk add --no-cache g++

# Accepts local (what code to copy) then container (where to copy)
# . means give location of root directory
# COPY . /app
# First dot represents your local server, and second the working directory
COPY package*.json ./

# Can we have multiple run statements in our docker file?
# Yes we can
RUN npm i

# COPY <local> <container>
COPY . .

# You can expose different ports as well
EXPOSE 8000

# To start the project
# Can also use ENTRYPOINT
# We can not have multiple commands, because we can only run server once
CMD ["node", "index.js"]