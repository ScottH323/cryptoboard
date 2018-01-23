const {Pool} = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT),
});

module.exports = {

    /**
     * Provide nice access to the underlying pool interface through a single endpoint
     * @param text
     * @param params
     */
    query: (text, params) => pool.query(text, params),

    /**
     * Handles creating all our required tables
     */
    migrate: async () => {

        //Create users table
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
        )`);

        //Create profiles table
        await pool.query(`CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        name VARCHAR(255) NOT NULL
        )`);

        //Creates currency table
        await pool.query(`CREATE TABLE IF NOT EXISTS currency (
        id SERIAL PRIMARY KEY,
        ex_id VARCHAR(50) NOT NULL
        )`);

        //Creates currency_profiles join table with additional buy price
        await pool.query(`CREATE TABLE IF NOT EXISTS currency_profiles (
        id SERIAL PRIMARY KEY,
        currency_id INTEGER REFERENCES profiles(id) NOT NULL,
        profile_id INTEGER REFERENCES profiles(id) NOT NULL,
        buy_price NUMERIC(4) NOT NULL,
        cid VARCHAR(10) UNIQUE
        )`);


        //TODO Handle indexes
    },

    /**
     * Handles seeding in initial config
     */
    seed: async () => {

        const {rows} = await pool.query("SELECT id FROM users where id = 1 LIMIT 1");
        if (rows.length > 0) return;

        const hash = await bcrypt.hash('demo123', 10);
        await pool.query("INSERT INTO users VALUES($1,$2,$3,$4)", [1, "Board Demo", "demo@demo.com", hash])
    }
};