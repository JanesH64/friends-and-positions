FROM node:latest AS build
WORKDIR /frontend
COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:latest
COPY --from=build /frontend/dist/frontend/ /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443