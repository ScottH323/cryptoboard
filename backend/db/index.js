const {Pool}     = require('pg');
const bcrypt     = require('bcrypt');
const CoinMarket = require('../models/coinmarket');

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: parseInt(process.env.PG_PORT),
});

/**
 * Imports currencies from coinmarketcap
 *
 * @return {Promise.<void>}
 */
async function importCurrencies() {
    const imp = await CoinMarket.retrieve();

    for (let i of imp) {
        await pool.query(`INSERT INTO currency (symbol,ex_id) VALUES ($1,$2) ON CONFLICT (ex_id) DO NOTHING;`, [i.symbol, i.id])
    }
}

/**
 * Seeds the users table
 *
 * @return {Promise.<void>}
 */
async function seedUsers() {
    console.log("Seeding users");

    const {rows} = await pool.query("SELECT id FROM users where id = 1 LIMIT 1");
    if (rows.length > 0) return;

    const hash = await bcrypt.hash('demo123', 10);
    await pool.query("INSERT INTO users VALUES($1,$2,$3,$4)", [1, "Board Demo", "demo@demo.com", hash]);
}

/**
 * Seeds the profiles table
 * @return {Promise.<void>}
 */
async function seedProfiles() {
    console.log("Seeding profiles");

    const {rows} = await pool.query("SELECT id FROM profiles where id = $1 LIMIT 1", [1]);
    if (rows.length) return;

    await pool.query("INSERT INTO profiles VALUES($1,$2,$3)", [1, 1, "Example Profile"]);
}

/**
 * Seeds the currency table
 *
 * @return {Promise.<void>}
 */
async function seedCurrency() {
    console.log("Seeding currency");

    //TODO import these at a later date
    const {rows} = await pool.query("SELECT count(1) as all from currency", []);
    if (rows[0].all >= 3) return;

    await pool.query("INSERT INTO currency (id,symbol,ex_id) VALUES (1,'BTC','bitcoin'),(2,'ETH','ethereum'),(3,'XRP','ripple')", []);
}

/**
 * Seeds the currency_profiles table
 *
 * @return {Promise.<void>}
 */
async function seedJoin() {
    console.log("Seeding join table");

    const {rows} = await pool.query("SELECT * from currency_profiles where profile_id = $1", [1]);
    if (rows.length >= 3) return;


    await pool.query(`INSERT INTO currency_profiles (currency_id, profile_id,amount, buy_price, cid) VALUES 
    (1,1,0.7,20000.00,'1_1_20000.00'), 
    (2,1,1.2,10000.00,'2_1_10000.00'), 
    (3,1,3,100.00,'3_1_100.00')`);
}

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
        symbol VARCHAR(10) NOT NULL,
        ex_id VARCHAR(50) NOT NULL UNIQUE
        )`);

        //Creates currency_profiles join table with additional buy price
        await pool.query(`CREATE TABLE IF NOT EXISTS currency_profiles (
        id SERIAL PRIMARY KEY,
        currency_id INTEGER REFERENCES currency(id) NOT NULL,
        profile_id INTEGER REFERENCES profiles(id) NOT NULL,
        amount NUMERIC NOT NULL,
        buy_price NUMERIC NOT NULL,
        cid VARCHAR(100) UNIQUE
        )`);


        //TODO Handle indexes
    },

    /**
     * Handles seeding in initial config
     */
    seed: async () => {
        await seedUsers().catch(err => {
            console.error(err.stack)
        });

        await seedProfiles().catch(err => {
            console.error(err.stack)
        });

        await seedCurrency().catch(err => {
            console.error(err.stack)
        });

        await seedJoin().catch(err => {
            console.error(err.stack)
        });

        //Import our currencies
        await importCurrencies().catch(err => {
            console.error(err.stack)
        });
    }
};