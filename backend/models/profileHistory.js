const db     = require('../db');
const errors = require('../errors');

class ProfileHistory {

    /**
     * Returns the history of the profile over the past 5 days
     *
     * @param profileId
     * @return {Promise.<void>}
     */
    static async all(profileId) {
        const date = new Date(new Date().setDate(new Date().getDate() - 2));

        const {rows} = await db.query("SELECT * FROM profile_history WHERE profile_id = $1 AND created_at >= $2 ORDER BY created_at DESC LIMIT 48", [profileId, date]);

        if (!rows.length)
            throw errors.NotFound;

        return rows.reverse();
    }

    /**
     * Add history entry for a profile
     *
     * @param profileId
     * @param investment
     * @param profit
     * @param date
     * @return {Promise.<void>}
     */
    static async addHistory(profileId, investment, profit, date) {
        await db.query("INSERT INTO profile_history (profile_id,total_investment,total_profit,created_at) VALUES($1,$2,$3,$4)", [profileId, investment, profit, date])
    }

}

module.exports = ProfileHistory;