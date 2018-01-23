const db     = require('../db');
const errors = require('../errors');
const bcrypt = require('bcrypt');


/**
 * User {
 *  id int
 *  name string
 *  email string
 *  password string (hashed)
 * }
 */
class User {
    /**
     * Returns the specified user
     *
     * @param id
     * @return {Promise.<*>}
     */
    static async find(id) {
        const {rows} = await db.query("SELECT id,email,name FROM users WHERE id = $1 LIMIT 1", [id]);

        if (!rows.length)
            throw errors.NotFound;

        return rows[0];
    }

    /**
     * Returns the specified user by username
     *
     * NB: Internal Only - Exposes password hash
     *
     * @param email
     * @return {Promise.<*>}
     */
    static async byEmail(email) {
        const {rows} = await db.query("SELECT * FROM users WHERE email=$1 LIMIT 1", [email]);

        if (!rows.length)
            throw errors.NotFound;

        return rows[0];
    }

    /**
     * Create a new user instance
     *
     * @param user
     * @return {Promise.<void>}
     */
    static async create(user) {

        const exists = await User.byEmail(user.email);
        if (exists.length)
            throw errors.EmailExists;

        const hash = await bcrypt.hash(user.password, 10);

        //TODO error handling
        const userNew = await db.query("INSERT INTO users (id,name,email,password) VALUES (DEFAULT,$1,$2,$3) RETURNING id,name,email", [user.name, user.email, hash]);

        return userNew.rows[0];
    }

    /**
     * Update a users name and email, password will be separate call
     *
     * @param id
     * @param user
     * @return {Promise.<void>}
     */
    static async update(id, user) {

        const exists = await User.find(id);
        if (!exists.length)
            throw errors.NotFound;

        const userUp = await db.query("UPDATE users set name=$1, email=$2 WHERE id=$3 RETURNING id,name,email", [user.name, user.email, id]);

        return userUp.rows[0];
    }

    /**
     * Delete user from db
     *
     * @param id
     * @return {Promise.<void>}
     */
    static async destroy(id) {
        const user = await User.find(id);
        if (!user.length)
            throw errors.NotFound;

        await db.query("DELETE from users WHERE id=$1", [id]);
    }
}

module.exports = User;