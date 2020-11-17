FROM node:12.13.1-alpine3.10 AS build

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY . .

RUN yarn generate

# https://hub.docker.com/_/nginx
FROM nginx:1.17.6-alpine

COPY --from=build /app/dist /usr/share/nginx/html/

EXPOSE 3000
