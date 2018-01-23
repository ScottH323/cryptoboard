const db = require('../db');

// const errors = require('../errors');

/**
 * Currency {
 *  id int
 *  ex_id string (bitcoin, ether)
 * }
 */
class Currency {

    /**
     * Return all listed currency
     * @return {Promise.<void>}
     */
    static async all() {
        const {rows} = await db.query("SELECT * FROM currency");

        return rows;
    }
}

module.exports = Currency;