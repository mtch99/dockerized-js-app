FROM node:20-alpine

ENV MONGODB_PASSWORD="password"
ENV MONGODB_USERNAME="admin"

RUN mkdir -p /home/app

COPY ./app /home/app

WORKDIR /home/app

RUN npm install

CMD ["node", "server.js"]