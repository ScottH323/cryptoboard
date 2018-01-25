<style>
    .good {
        color: green;
    }

    .bad {
        color: red;
    }
</style>

<template>
    <table class="table table-responsive">
        <thead>
        <tr>
            <th>Symbol</th>
            <th>Amount</th>
            <th>Buy Price</th>
            <th>Current Price</th>
            <th>Profit</th>
            <th>Inc.</th>
            <th>Options</th>
        </tr>
        </thead>

        <tbody>
        <tr v-if="renderTable" v-for="i in calcInvestments">
            <td>{{ i.symbol }}</td>
            <td>{{ i.amount }}</td>
            <td>{{ toCur(i.buy_price) }}</td>
            <td>{{ toCur(i.currentPrice) }}</td>
            <td>{{ toCur(i.profit) }}</td>
            <td>{{ i.percent }}%</td>
            <td>
                <button class="btn btn-sm btn-danger" v-on:click="deleteInvestment(i.id)">Delete</button>
            </td>
        </tr>

        <tr class="total">
            <td>TOTAL</td>
            <td></td>
            <td>{{ toCur(summary.totalSpent) }}</td>
            <td></td>
            <td v-bind:class="{ good: (summary.averageIncrease > 0), bad: (summary.averageIncrease <= 0) }">
                {{ toCur(summary.totalProfit) }}
            </td>
            <td v-bind:class="{ good: (summary.averageIncrease > 0), bad: (summary.averageIncrease <= 0) }">
                {{ summary.averageIncrease }}%
            </td>
            <td></td>
        </tr>
        </tbody>
    </table>
</template>

<script>
    import Worker from '../../workers/currency.worker';

    export default {
        data() {
            return {
                hasInvestments: false,
                renderTable: false,
                summary: {
                    totalSpent: 0.9,
                    totalProfit: 123,
                    averageIncrease: 0.9
                },
                profile: {
                    id: 0,
                    investments: []
                },
            }
        },
        computed: {
            /**
             * Loops through current investments and calculates profit/loss
             */
            calcInvestments() {

                const currency           = this.$store.getters.getCurrency;
                let percents             = [];
                this.summary.totalSpent  = 0;
                this.summary.totalProfit = 0;

                if (!currency)
                    return [];

                //Handle some sync issues
                if (!this.$store.getters.getDashboard && !this.hasInvestments) {
                    this.getInvestments();
                    return;
                }

                for (let i of this.$store.getters.getDashboard.investments) {
                    let unitPrice        = i.buy_price * i.amount;
                    let currentUnitPrice = currency[i.ex_id] * i.amount;

                    i.currentPrice    = currency[i.ex_id];
                    i.profit          = currentUnitPrice - unitPrice;
                    i.percent         = ((currency[i.ex_id] - unitPrice) / unitPrice * 100).toFixed(2);
                    i.totalInvestment = this.toCur(unitPrice);

                    this.summary.totalSpent += parseInt(unitPrice);
                    this.summary.totalProfit += i.profit;

                    percents.push(parseFloat(i.percent));
                }

                this.summary.averageIncrease = (percents.reduce((a, b) => a + b, 0) / percents.length).toFixed(2);

                return this.$store.getters.getDashboard.investments
            }
        },
        methods: {

            /**
             * Converts value to monetary string in USD
             */
            toCur(val) {
                const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                });

                return formatter.format(val)
            },

            /**
             * Queries the API for the current investment profile
             */
            getInvestments() {
                this.hasInvestments = true;
                window.axios.get(`/profiles/${this.$store.getters.getUser.id}/investments`).then((resp) => {
                    this.profile = resp.data.profile;
                    this.$store.commit('updateDashboard', resp.data.profile);
                    this.hasInvestments = false;
                });
            },

            /**
             * Delete an investment by its id, use profile id to prevent cross-profile deletion
             */
            deleteInvestment(investId) {
                window.axios.delete(`/profiles/${this.$store.getters.getUser.id}/investments/${investId}`).then((resp) => {
                    this.profile = resp.data.profile;
                    this.$store.commit('updateDashboard', resp.data.profile);
                    this.hasInvestments = false;
                });
            },

            /**
             * Starts service worker to poll the coinmarketcap API
             */
            startWorker() {

                const w1 = new Worker();

                w1.postMessage({start: true, token: this.$store.getters.getToken});

                /**
                 * Message will return our crypto array to push over to the store
                 * @param event
                 */
                w1.onmessage = (event) => {
                    this.renderTable = true;
                    this.$store.commit('updateCurrency', event.data.currency);
                };
            }
        },
        beforeMount() {
            this.startWorker();
            this.getInvestments();
        }
    }
</script>