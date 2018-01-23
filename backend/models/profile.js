const db     = require('../db');
const errors = require('../errors');

/**
 * Profile {
 *  id int
 *  user_id int
 *  name string
 * }
 */
class Profile {

    /**
     * Find by user_id
     *
     * NB: This can return multiple as a user can create multiple profiles
     *
     * @param userId
     * @return {Promise.<void>}
     */
    static async findByUser(userId) {
        const {rows} = await db.query("SELECT * FROM profiles WHERE user_id = $1", [userId]);

        if (!rows.length)
            throw errors.NotFound;

        return rows;
    }

    /**
     * Find by profile_id
     *
     * @param id
     * @return {Promise.<void>}
     */
    static async find(id) {
        const {rows} = await db.query("SELECT * FROM profiles WHERE id = $1 LIMIT 1", [id]);

        if (!rows.length)
            throw errors.NotFound;

        return rows[0];
    }

    /**
     * Update the name of the profile
     *
     * @param id
     * @param name
     * @return {Promise.<void>}
     */
    static async update(id, name) {
        const exists = await Profile.find(id);
        if (!exists.length)
            throw errors.NotFound;

        const userUp = await db.query("UPDATE profiles set name=$1 WHERE id=$3 RETURNING *", [name, id]);
        return userUp.rows[0];
    }


    /**
     * Delete profile from db
     *
     * @param id
     * @return {Promise.<void>}
     */
    static async destroy(id) {
        const {rows} = await Profile.find(id);
        if (!rows.length)
            throw errors.NotFound;

        await db.query("DELETE from profiles WHERE id=$1", [id]);
    }

    /**
     * Create a new profile
     *
     * NB: this is called on user creation and if it ends up supporting multiple profiles
     *
     * @param userId
     * @param name
     * @return {Promise.<void>}
     */
    static async create(userId, name) {
        const exists = await Profile.findByUser(userId);
        if (!exists.length)
            throw errors.NotFound;

        const {rows} = await db.query("INSERT INTO profiles (id,user_id,name) VALUES (DEFAULT,$1,$2) RETURNING *", [userId, name]);

        return rows[0];
    }

    /**
     * Assign a currency and price to the profile
     *
     * @param id
     * @param currencyId
     * @param amount
     * @param buyPrice
     * @return {Promise.<void>}
     */
    static async invest(id, currencyId, amount, buyPrice) {

        const cid = `${id}_${currencyId}_${buyPrice}`; //Use buyprice to ensure we keep separate buy prices
        console.log(`Checking cid: ${cid}`);

        const existing = await db.query("SELECT id,amount from currency_profiles WHERE cid=$1 LIMIT 1", [cid]);
        console.log(existing.rows[0]);

        if (existing.rows.length > 0) {
            const exOld = existing.rows[0];
            let amntNew = parseFloat(exOld.amount) + parseFloat(amount);

            const {rows} = await db.query("UPDATE currency_profiles SET amount=$2 WHERE id=$1 RETURNING *", [exOld.id, amntNew]);

            return rows[0];
        }

        const {rows} = await db.query(`INSERT INTO currency_profiles 
        (profile_id,currency_id,amount,buy_price,cid) 
        VALUES ($1,$2,$3,$4,$5) RETURNING *`, [id, currencyId, amount, buyPrice, cid]);

        return rows[0];
    }


    /**
     * Gets all investments on the profile and returns them
     *
     * @param id
     * @return {Promise.<void>}
     */
    static async allInvestments(id) {
        const {rows} = await db.query(`SELECT currency_id, amount,buy_price, symbol, ex_id  FROM currency_profiles JOIN currency ON currency_profiles.currency_id = currency.id`)
        console.log(rows);

        return rows;
    }
}


module.exports = Profile;