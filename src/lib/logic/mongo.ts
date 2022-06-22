import { MongoClient, ObjectId } from 'mongodb';

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'cbrn-spread';

export type CollectionName = 'spread' | 'unit';

export const connect = async (collectionName: CollectionName) => {
  await client.connect();
  // console.log('Connected successfully to server');
  return client.db(dbName).collection(collectionName);
};

export const close = () => {
  client.close();
  // console.log('Closed connection to server');
};
