FROM node:16 AS builder

WORKDIR /index.js

COPY ./package.json ./

RUN npm i

COPY . .

EXPOSE 5000

CMD ["npm", "run", "start"]