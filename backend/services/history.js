const CoinMarket     = require('../models/coinmarket');
const Profile        = require('../models/profile');
const ProfileHistory = require('../models/profileHistory');

class HistoryService {

    /**
     * Start the service
     */
    start() {
        this.addHistoryEntry().catch((e) => {
            console.log(e.trace);
        }); //TEST only

        const pollTime = 1000 * 60 * 60; //1 hour
        this.timeout   = setTimeout(this.addHistoryEntry, pollTime)
    }

    /**
     * Stop the service
     */
    stop() {
        this.timeout = null;
    }

    /**
     * Loops through the active profiles
     * @return {Promise.<void>}
     */
    async addHistoryEntry() {
        this.currency = await CoinMarket.parse();

        const profiles = await Profile.all();

        for (let profile of profiles)
            this.calculateProfile(profile).catch((e) => {
                console.log(e.trace);
            })

    }

    /**
     * Calculates the profile investment and profit
     * @param profile
     * @return {Promise.<void>}
     */
    async calculateProfile(profile) {
        console.log(`Checking Profile ${profile.id}`);

        const investments = await Profile.allInvestments(profile.id);

        let totalInvestment = 0;
        let totalProfit     = 0;

        for (let i of investments) {
            let unitPrice        = i.buy_price * i.amount;
            let currentUnitPrice = this.currency[i.ex_id] * i.amount;

            totalProfit += currentUnitPrice - unitPrice;
            totalInvestment += unitPrice;
        }

        console.log(`Adding History - Profile: ${profile.id} - Invested: ${totalInvestment} - Profit: ${totalProfit}`);

        //Add entry
        await ProfileHistory.addHistory(profile.id, totalInvestment, totalProfit, new Date())
    }
}

module.exports = HistoryService;