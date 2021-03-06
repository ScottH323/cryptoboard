const router         = require('koa-router')(); // router middleware for koa
const db             = require('../db');
const Profile        = require('../models/profile');
const ProfileHistory = require('../models/profileHistory');
const errors         = require('../errors');


const BASE = '/api/profiles';

/**
 * Get the profile
 *
 * NB: this doesn't include the investments
 */
router.get(`${BASE}/:id`, async (ctx) => {
    console.log(`GET ${BASE}/${ctx.params.id}`);

    try {
        // const profile = await Profile.find(ctx.params.id);
        const profiles = await Profile.findByUser(ctx.params.id);

        let profile = profiles[0]; //For now we will only allow a single profile per user

        ctx.body = {
            profile: profile,
        }

    } catch (e) {
        let err    = errors.ParseError(e);
        ctx.status = err.code;
        ctx.body   = err.message;
    }
});

/**
 * Update the profiles name
 */
router.put(`${BASE}/:id`, async (ctx) => {
    console.log(`PUT ${BASE}/${ctx.params.id}`);
    console.log(ctx.request.body);

    try {
        ctx.body = {
            user: await Profile.update(ctx.params.id, ctx.request.body.name)
        }
    } catch (e) {
        let err = errors.ParseError(e);

        ctx.status = err.code;
        ctx.body   = err;
    }

});

/**
 * Create a new profile for the account
 */
router.post(`${BASE}`, async (ctx) => {
    console.log(`POST ${BASE}`);
    console.log(ctx.request.body); //TODO validation

    let userId = ctx.request.body.userId; //TODO get from JWT
    let name   = ctx.request.body.name;

    try {
        ctx.body = {
            user: await Profile.create(userId, name),
        };

    } catch (e) {
        let err = errors.ParseError(e);

        ctx.status = err.code;
        ctx.body   = err;
    }
});

/**
 * Delete a profile
 */
router.delete(`${BASE}/:id`, async (ctx) => {
    console.log(`DELETE ${BASE}/${ctx.params.id}`);

    try {
        await Profile.destroy(ctx.params.id);
        ctx.body = {
            success: true,
            message: "Profile deleted"
        }

    } catch (err) {
        ctx.status = err.code;
        ctx.body   = err;
    }
});


/**
 * Return the history of the profile
 */
router.get(`${BASE}/:id/history`, async (ctx) => {
    console.log(`GET ${BASE}/${ctx.params.id}/history`);

    try {
        const profile = await Profile.findByUser(ctx.params.id);
        const history = await ProfileHistory.all(profile[0].id);

        ctx.body = {
            profile: {
                id: ctx.params.id,
                history: history
            }
        }

    } catch (e) {
        let err    = errors.ParseError(e);
        ctx.status = err.code;
        ctx.body   = err.message;
    }
});

/**
 * List all investments on a profile
 */
router.get(`${BASE}/:id/investments`, async (ctx) => {
    console.log(`GET ${BASE}/${ctx.params.id}/investments`);

    try {
        const invest = await Profile.allInvestments(ctx.params.id);

        ctx.body = {
            profile: {
                id: ctx.params.id,
                investments: invest
            }
        }

    } catch (e) {
        let err    = errors.ParseError(e);
        ctx.status = err.code;
        ctx.body   = err.message;
    }

});

/**
 * Create a new investment
 */
router.post(`${BASE}/:id/investments`, async (ctx) => {
    console.log(`POST ${BASE}/${ctx.params.id}/investments`);

    let curId = ctx.request.body.currencyId;
    let price = ctx.request.body.buyPrice;
    let amnt  = ctx.request.body.quantity;

    try {
        const res = await Profile.invest(ctx.params.id, curId, amnt, price);

        //Return the updated account investments
        const invest = await Profile.allInvestments(ctx.params.id);

        ctx.body = {
            profile: {
                id: ctx.params.id,
                investments: invest
            }
        }

    } catch (e) {
        let err    = errors.ParseError(e);
        ctx.status = err.code;
        ctx.body   = err.message;
    }
});


/**
 * Create a new investment
 */
router.delete(`${BASE}/:id/investments/:invId`, async (ctx) => {
    console.log(`DELETE ${BASE}/${ctx.params.id}/investments/${ctx.params.invId}`);

    try {
        if (!ctx.params.id || !ctx.params.invId)
            throw errors.ArgsError;


        await Profile.uninvest(ctx.params.id, ctx.params.invId);

        //Return the updated account investments
        const invest = await Profile.allInvestments(ctx.params.id);

        ctx.body = {
            profile: {
                id: ctx.params.id,
                investments: invest
            }
        }

    } catch (e) {
        let err    = errors.ParseError(e);
        ctx.status = err.code;
        ctx.body   = err.message;
    }
});

module.exports = router.middleware();