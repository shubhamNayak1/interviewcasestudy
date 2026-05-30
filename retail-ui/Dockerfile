# --- Build stage ---
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json .
RUN npm install --silent
COPY . .
ENV REACT_APP_COLLECTOR_URL=http://localhost:8080
RUN npm run build

# --- Serve stage ---
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
