const router   = require('koa-router')();
const errors   = require("../errors");
const Currency = require('../models/currency');

const BASE = '/currency';

router.get(`${BASE}`, async (ctx) => {
    console.log(`GET ${BASE}`);

    try {
        const cur = await Currency.all();

        ctx.body = {
            currency: cur
        }

    } catch (e) {
        let err = errors.ParseError(e);

        ctx.status = err.code;
        ctx.body   = err;
    }
});


module.exports = router.middleware();