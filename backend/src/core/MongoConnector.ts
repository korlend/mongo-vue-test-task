
import { MongoClient } from 'mongodb';

export default class MongoConnector {
  static async createConnection(URI: string): Promise<MongoClient> {
    const client = new MongoClient(URI);
    await client.connect();
    await client.db("donations").command({ ping: 1 });
    return client;
  }
}
