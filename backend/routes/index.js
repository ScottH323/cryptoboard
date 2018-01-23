const Router = require('koa-router');
const router = new Router();

/**
 * Test endpoint
 * TODO Remove
 */
router.get('/', async (ctx) => {
    ctx.body = {
        status: 'success',
        message: 'hello, world!'
    };
});

module.exports = router;