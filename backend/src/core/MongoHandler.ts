
import { Collection, MongoClient } from 'mongodb';

class MongoHandlerSingleton {
  static handler: MongoHandler = null;
}

export default class MongoHandler {

  private client: MongoClient = null;

  constructor(client: MongoClient) {
    if (MongoHandlerSingleton.handler !== null) {
      Object.assign(MongoHandlerSingleton.handler);
    } if (client) {
      this.client = client;
      MongoHandlerSingleton.handler = this;
    } else {
      throw new Error('There is no present established connection to the database');
    }
  }

  public getCollection(dbName: string, collectionName: string): Collection {
    const db = this.client.db(dbName);
    const collection = db.collection(collectionName);
    return collection;
  }
}
