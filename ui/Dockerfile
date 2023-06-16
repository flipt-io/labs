FROM node:18-alpine3.16
ENV NODE_ENV=development

WORKDIR /ui

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npx", "nodemon", "-L", "--ext", "ts,tsx", "--exec", "npm", "start"]