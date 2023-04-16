FROM node:latest AS build
WORKDIR /frontend
COPY . .
RUN npm install
RUN npm run build

FROM nginx:latest
COPY --from=build /frontend/dist/frontend/ /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 443