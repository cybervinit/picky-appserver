FROM node:carbon
RUN npm install pm2 -g

WORKDIR /usr/src/app

COPY pm2.json ./
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["pm2-runtime", "pm2.json", "--only", "web"]

