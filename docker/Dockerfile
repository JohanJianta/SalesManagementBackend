FROM node:22.14.0-alpine

WORKDIR /app

COPY ../package*.json ./

COPY .. .

RUN npm install && npm cache clean --force

EXPOSE 3000

CMD ["npm", "run", "start"]