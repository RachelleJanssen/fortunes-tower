FROM node:14.4-alpine

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY ./ ./

RUN npm run build:main


EXPOSE 3000

CMD npm run serve
