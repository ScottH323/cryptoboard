const router = require('koa-router')(); // router middleware for koa
const db     = require('../db');


const BASE = '/profile';

router.get(`${BASE}/:id`, async (ctx) => {
    console.log(`GET ${BASE}/${ctx.params.id}`);
});

module.exports = router.middleware();