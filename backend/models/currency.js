const db         = require('../db');
const errors     = require('../errors');
const CoinMarket = require('./coinmarket');

/**
 * Currency {
 *  id int
 *  symbol string (BTC,ETH)
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

    static async findByName(name) {
        const {rows} = await db.query("SELECT * FROM currency WHERE ex_id = $1 LIMIT 1", [name]);

        if (!rows.length)
            throw errors.NotFound;

        return rows[0];
    }
}

module.exports = Currency;