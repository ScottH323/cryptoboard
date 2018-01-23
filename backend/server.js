const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
    throw result.error
}

const Koa        = require('koa');
const BodyParser = require('koa-bodyparser');
const jwt        = require('jsonwebtoken');
const errors     = require('./errors');
const db         = require('./db');

db.migrate(); //Run through migrations and setup DB
db.seed();

const app = module.exports = new Koa();
app.use(BodyParser());

/**
 * Non-Auth endpoints here
 */
app.use(require('./routes/auth.js'));

/**
 * JWT checks
 */
app.use(async (ctx, next) => {
    if (!ctx.header.authorization) ctx.throw(401, 'Authorization required');

    const [scheme, token] = ctx.header.authorization.split(' ');
    if (scheme !== 'Bearer') ctx.throw(401, 'Invalid authorization');

    try {
        const payload  = jwt.verify(token, process.env.APP_KEY);
        ctx.state.user = payload;

    } catch (e) {
        let err = ctx.ParseError(e);

        if (e.message === 'invalid token') //Override
            err = errors.AuthError;

        ctx.status = err.code;
        ctx.body   = err;
    }

    await next();
});

/**
 * Handle Authed routes here for simplicity
 */
app.use(require('./routes/currency.js'));
app.use(require('./routes/profile.js'));
app.use(require('./routes/user.js'));

app.listen(3000);