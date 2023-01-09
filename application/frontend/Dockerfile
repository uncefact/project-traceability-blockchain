FROM node:12 as builder
WORKDIR /app
COPY clients/unece-cotton-fetch /app/clients/unece-cotton-fetch
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY tsconfig.json /app/tsconfig.json
COPY global-setup.js /app/global-setup.js
COPY public/ /app/public/
COPY src/ /app/src/
RUN npm ci
# RUN npm run test -- --watchAll=false  keep commented until test refactor frontend #259
RUN npm run build http://www.unecettbcpilot.ch/api

FROM nginx:stable-alpine as runner

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html
