import { MongoClient, Db } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://root:example@localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'jobmatcher';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getMongoClient(): Promise<{ client: MongoClient, db: Db }> {
  if (client && db) return { client, db };
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(MONGO_DB);
    return { client, db };
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  }
}