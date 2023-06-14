FROM node:18-alpine3.16

WORKDIR /ui

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "start"]