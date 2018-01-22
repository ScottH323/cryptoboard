const db = require('../db');

class User {


    /**
     * Returns the specified user
     *
     * @param id
     * @return {Promise.<*>}
     */
    static async find(id) {
        const {rows} = await db.query("SELECT * FROM users WHERE id = $1 LIMIT 1", [id]);
        //TODO ERR Checking

        return rows;
    }

    /**
     * Returns the specified user by username
     *
     * @param username
     * @return {Promise.<*>}
     */
    static async byUsername(username) {
        const {rows} = await db.query("SELECT * FROM users WHERE username = $1 LIMIT 1", [username]);
        //TODO ERR Checking

        return rows;
    }

    static async create() {

    }

    static async update() {

    }

    static async delete() {

    }
}

module.exports = User;