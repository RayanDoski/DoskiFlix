# Steg 1: Bygg React-applikationen
FROM node:18-alpine as frontend-build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Steg 2: Kör Nginx
FROM nginx:alpine as frontend

COPY --from=frontend-build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80