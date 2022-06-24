import { MongoClient, ObjectId } from 'mongodb';

// Connection URL
const host = process.env.MONGO || 'localhost';
const url = `mongodb://${host}`;
const client = new MongoClient(url, {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 10000,
  serverSelectionTimeoutMS: 5000,
});

// Database Name
const dbName = 'cbrn-spread';

export type CollectionName = 'spread' | 'unit' | 'mission' | 'measure';

export const connect = async (collectionName: CollectionName) => {
  await client.connect();
  // console.log('Connected successfully to server');
  return client.db(dbName).collection(collectionName);
};

export const close = () => {
  client.close();
  // console.log('Closed connection to server');
};
