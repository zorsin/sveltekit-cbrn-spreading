FROM node:lts-alpine3.16

#RUN mkdir -p /app

WORKDIR /app
# order: less changing to often changing

# GEN by openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes -subj '/CN=localhost'
COPY ./config/cert.pem .
COPY ./config/key.pem .
# COPY ./config/docker.toml ./local.toml

COPY ./build/package.json ./

RUN npm install

COPY ./build .

ENV CBRN_MONGO=127.0.0.1:27017
ENV CBRN_SSL_KEY=./key.pem
ENV CBRN_SSL_CERT=./cert.pem
ENV PORT=3000
ENV HOST=localhost
# ENV ORIGIN=localhost

EXPOSE 3000

CMD [ "node", "server.js" ]

#  docker run --env MONGO=172.17.0.3:27017-d -p 3000:3000 wirries/cbrn-spread