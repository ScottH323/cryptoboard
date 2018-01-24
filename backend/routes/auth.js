const router = require('koa-router')();
const jwt    = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const errors = require('../errors');

const User = require('../models/user');

const BASE = '/auth';

/**
 * Login and check credentials then provide JWT
 */
router.post(`${BASE}/login`, async (ctx) => {
    console.log(`POST ${BASE}/login - ${ctx.request.body.email}`);
    console.log(ctx.request.body);

    try {
        const user  = await User.byEmail(ctx.request.body.email);
        const match = await bcrypt.compare(ctx.request.body.password, user.password);

        if (!match)
            throw errors.AuthError;

        console.log("Building payload");
        const payload = {
            id: user.id,
        };

        const token = jwt.sign(payload, process.env.APP_KEY, {expiresIn: '24h'});
        delete user.password;

        ctx.body = {token: token, user: user};

    } catch (e) {
        console.log(e);

        let err    = errors.ParseError(e);
        ctx.status = err.code;
        ctx.body   = err.message;
    }
});

module.exports = router.middleware();