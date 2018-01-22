const Koa       = require('koa');
const KoaRouter = require('koa-router');
const jwt       = require('jsonwebtoken');

const app = module.exports = new Koa();


app.use(require('./routes/currency.js'));
app.use(require('./routes/auth.js'));

/**
 * Verify if the specified JWT token is valid or not
 */
app.use(async function verifyJwt(ctx, next) {
    if (!ctx.header.authorization) ctx.throw(401, 'Authorisation required');
    const [scheme, token] = ctx.header.authorization.split(' ');
    if (scheme !== 'Bearer') ctx.throw(401, 'Invalid authorisation');

    const roles = {g: 'guest', a: 'admin', s: 'su'};

    try {
        const payload  = jwt.verify(token, 'eAmC8mlvtrnCTLWBh7jCtMFlxa5CpRFH');
        ctx.state.user = payload;

    } catch (e) {
        if (e.message === 'invalid token') ctx.throw(401, 'Invalid JWT'); // Unauthorized
        ctx.throw(e.status || 500, e.message); // Internal Server Error
    }

    await next();
});

app.listen(3000);