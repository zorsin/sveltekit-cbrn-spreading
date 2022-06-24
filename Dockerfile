FROM node:lts-alpine3.16

#RUN mkdir -p /app

WORKDIR /app
# order: less changing to often changing

COPY ./config/server.crt .
COPY ./config/server.key .
# COPY ./config/docker.toml ./local.toml

COPY ./build/package.json ./

RUN npm install

COPY ./build .

ENV MONGO=127.0.0.1:27017
ENV SSL_KEY=./server.key
ENV SSL_CERT=./server.crt
ENV PORT=3000
ENV HOST=localhost
# ENV ORIGIN=localhost

EXPOSE 3000

CMD [ "node", "server.js" ]

#  docker run --env MONGO=172.17.0.3:27017-d -p 3000:3000 wirries/cbrn-spread