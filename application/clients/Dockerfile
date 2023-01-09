FROM node:12
WORKDIR /app
COPY unece-cotton-fetch/src /app/src
COPY unece-cotton-fetch/package.json /app/package.json
COPY unece-cotton-fetch/tsconfig.json /app/tsconfig.json
RUN npm i --unsafe-perm
