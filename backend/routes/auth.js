const router = require('koa-router')(); // router middleware for koa
const jwt    = require('jsonwebtoken'); // JSON Web Token implementation
const scrypt = require('scrypt');

const User = require('../models/user');

router.get('/auth', async function getAuth(ctx) {
    const [user] = await User.byUsername(ctx.query.username);

    if (!user) ctx.throw(404, 'Username/password not found');

    // check password
    try {
        const match = await scrypt.verifyKdf(Buffer.from(user.Password, 'base64'), ctx.query.password);

        if (!match) ctx.throw(404, 'Username/password not found');

        const payload = {
            id: user.UserId,                         // to get user details
            role: user.Role.slice(0, 1).toLowerCase(), // make role available without db query
        };

        const token = jwt.sign(payload, 'eAmC8mlvtrnCTLWBh7jCtMFlxa5CpRFH', {expiresIn: '24h'});
        ctx.body    = {jwt: token, root: 'Auth'};

    } catch (e) {

        ctx.throw(404, 'Username/password not found');
    }
});

module.exports = router.middleware();