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
docker run -d -p 27017:27017 --name mongo-cbrn mongo

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