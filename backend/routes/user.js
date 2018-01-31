const router = require('koa-router')();
const errors = require('../errors');
const db     = require('../db');
const User   = require('../models/user');

const BASE = "/api/users";

/**
 * Return a list of all users
 * TODO Complete
 * TODO Validation
 */
router.get(`${BASE}`, async (ctx) => {
    console.log(`GET ${BASE}`);

    ctx.body = {
        status: 'OK'
    }
});

/**
 * Return a single user
 * TODO Validation
 */
router.get(`${BASE}/:id`, async (ctx) => {
    console.log(`GET ${BASE}/${ctx.params.id}`);

    const user = await User.find(ctx.params.id);
    if (!user.length) {
        ctx.status = 404;
        ctx.body   = errors.NotFound;
        return;
    }

    ctx.body = user
});

/**
 * Update an existing user
 * TODO Validation
 */
router.put(`${BASE}/:id`, async (ctx) => {
    console.log(`PUT ${BASE}/${ctx.params.id}`);
    console.log(ctx.request.body);

    try {
        ctx.body = {
            user: await User.update(ctx.params.id, ctx.request.body)
        }
    } catch (e) {
        let err = errors.ParseError(e);

        ctx.status = err.code;
        ctx.body   = err;
    }

});

/**
 * Create a new user
 * TODO validation
 */
router.post(`${BASE}`, async (ctx) => {
    console.log(`POST ${BASE}`);
    console.log(ctx.request.body);

    try {
        ctx.body = {
            user: await User.create(ctx.request.body),
        };

    } catch (e) {
        let err = errors.ParseError(e);

        ctx.status = err.code;
        ctx.body   = err;
    }
});

/**
 * Delete a user
 * TODO Validation + Auth
 */
router.delete(`${BASE}/:id`, async (ctx) => {
    console.log(`DELETE ${BASE}/${ctx.params.id}`);

    try {
        await User.destroy(ctx.params.id);
        ctx.body = {
            success: true,
            message: "User deleted"
        }

    } catch (err) {
        ctx.status = err.code;
        ctx.body   = err;
    }
});

module.exports = router.middleware();