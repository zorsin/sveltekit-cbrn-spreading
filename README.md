# CBRN Spreading

# Page Layout 

Elements:
```
├── /
│   └── landing
├── commander/
│   ├── creates as a spread and manages units
│   ├── create/
│   │   └── creates a new spread
│   └── view/
│       └── view existing spread, see current units
├── units/   
│   ├── units with the crew for the measurement run
│   ├── continuous/
│   │   └── for crews with continuous measurement devices
│   └── spot/
│       └── for crews with spot measurement devices
└── api/
    ├── spread
    │   ├── calc
    │   ├── save
    ├── unit

```

# Database


https://earthly.dev/blog/mongodb-docker/

```bash
# simply
docker run -d -p 27017:27017 --name mongo-cbrn mongo:4.2.21

docker exec -it mongo-cbrn bash
```
Inside the container
```bash
mongosh

db.getCollectionNames()

# to find all entries
db.<collectionName>.find()
# to filter 
db.<collectionName>.find({"key":"value"})
# find by id
db.documents.find({"_id":ObjectId("62b2f813b987409d15e17ad0")})
# delete all with this filter
db.<collectionName>.deleteMany({"a":3})

```

# Docker Container

Container from docker with node image. Attention image is big!
```Dockerfile
FROM node:16

# Create app directory
WORKDIR /opt/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./build/package.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./build .

ENV MONGO=<mongodb>:27017
#ENV SSL_KEY=./config/server.key 
#ENV SSL_CERT=./config/server.crt

EXPOSE 3000
CMD [ "node", "server.js" ]
```

```
FROM alpine:3.16

RUN mkdir -p /app

WORKDIR /app
# order: less changing to often changing

COPY ./config/server.crt .
COPY ./config/server.key .
# COPY ./config/docker.toml ./local.toml
COPY ./dist/cbrn-spread_0-0-1 ./cbrn

ENV MONGO=127.0.0.1:27017
ENV SSL_KEY=./server.key
ENV SSL_CERT=./server.crt
ENV PORT=3000
ENV HOST=localhost
ENV ORIGIN=localhost

EXPOSE ${PORT}

ENTRYPOINT [ "/app/cbrn" ]
```