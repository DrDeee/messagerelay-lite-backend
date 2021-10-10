FROM node:14-alpine

WORKDIR /opt/fridaysforfuture/messagerelay-lite

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD ["node", "index.js"]