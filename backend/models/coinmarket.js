const axios  = require('axios');
const errors = require("../errors");

class CoinMarket {

    /**
     * Helper function to call CMC and return a parsed version
     * @return {Promise.<{}>}
     */
    static async retrieve() {
        const res = await axios.get('https://api.coinmarketcap.com/v1/ticker');

        //TODO Handle errors

        return res.data;
    }

    /**
     * Parses the response into a nice table we can reference via id
     * @param apiData
     * @return {{}}
     */
    static async parse() {
        const apiData = await this.retrieve();

        let table = {};

        for (let c of apiData)
            table[c.id] = c.price_usd;

        return table;
    }
}

module.exports = CoinMarket;