FROM node:10.16.3-alpine

WORKDIR /code

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . /code

EXPOSE 8080

ENV NODE_ENV=production

CMD ["node", "/code/scripts/script.js", "--config", "/app/config.json"]
