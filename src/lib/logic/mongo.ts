import { MongoClient, ObjectId } from 'mongodb';
import config from '$lib/config';
// Connection URL

const url = `mongodb://${config.get('mongo')}`;
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
