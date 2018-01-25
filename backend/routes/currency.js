const router     = require('koa-router')();
const errors     = require("../errors");
const Currency   = require('../models/currency');
const CoinMarket = require('../models/coinmarket');

const BASE = '/currency';

/**
 * Return all the current currencies we have profiles for
 */
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

router.get(`${BASE}/table`, async (ctx) => {
    console.log(`GET ${BASE}/table`);

    try {
        const cur = await CoinMarket.parse();

        ctx.body = {
            currency: cur,
        }
    } catch (e) {
        let err = errors.ParseError(e);

        ctx.status = err.code;
        ctx.body   = err;
    }
});


module.exports = router.middleware();