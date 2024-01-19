FROM node:14.0
RUN mkdir -p /app
WORKDIR /app
COPY ./package.json ./package-lock.json .
RUN npm install
COPY . .
EXPOSE 8080
CMD [ "npm", "run", "start"]