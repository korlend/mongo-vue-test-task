
import MongoHandler from "@src/core/MongoHandler";

declare module "koa" {
  interface ExtendableContext {
    dbhandler: MongoHandler;
  }
}
