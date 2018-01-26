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
        const date = new Date(new Date().setDate(new Date().getDate() - 5));

        const {rows} = await db.query("SELECT * FROM profile_history WHERE profile_id = $1 AND created_at >= $2 ORDER BY created_at ASC", [profileId, date]);

        if (!rows.length)
            throw errors.NotFound;

        return rows;
    }

}

module.exports = ProfileHistory;