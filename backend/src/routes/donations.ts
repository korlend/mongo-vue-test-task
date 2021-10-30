
import Koa from 'koa';
import Router from 'koa-router';

const router = new Router({
  prefix: '/donations',
});

router.post('/donate', async (ctx: Koa.ParameterizedContext) => {
  const amount = ctx.request.body.amount;
  const currency = ctx.request.body.currency
  if (!amount || !currency) {
    ctx.body = {"ok": false, "error": "Amount required"};
    return;
  }
  const client = ctx.dbhandler.getCollection('donations', 'donations');
  const result = await client.insertOne({
    amount,
    currency,
  });
  if (result.acknowledged === true) {
    ctx.body = {"ok": true};
  } else {
    ctx.body = {"ok": false, "error": "Amount required"};
  }
});

export default router;
