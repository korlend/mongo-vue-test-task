
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaCors from '@koa/cors';
import Router from 'koa-router';

import MongoConnector from './core/MongoConnector.js';
import MongoHandler from './core/MongoHandler.js';

import donationsRouter from './routes/donations.js';

const app = new Koa();

app.context.dbhandler = new MongoHandler(await MongoConnector.createConnection('mongodb://127.0.0.1:27017/?maxPoolSize=20&w=majority'));

app.use(koaCors({
  origin: 'http://localhost:8080',
}));
app.use(bodyParser());

app.use(async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx: Koa.ParameterizedContext, next: Koa.Next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

const router = new Router({
  prefix: '/api',
});
router.use(donationsRouter.routes());

app.use(router.routes());

app.listen(1337);
