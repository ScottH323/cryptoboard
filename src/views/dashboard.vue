<style>
    .total {
        font-weight: bold;
    }
</style>

<template>
    <section class="dashboard">
        <div class="row">
            <div class="col-12">
                <!-- Graph Here -->
                <profile-value></profile-value>
            </div>
        </div>

        <div class="row">
            <!--TODO limit to 4-->
            <div v-for=" investment in profile.investments">
                <currency-card :cur="investment"></currency-card>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <table class="table table-responsive">
                    <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Currency</th>
                        <th>Buy Price</th>
                        <th>Current Price</th>
                        <th>Profit</th>
                        <th>Inc.</th>
                        <th>Options</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="cur in profile.investments">
                        <td>{{cur.symbol}}</td>
                        <td>{{cur.name}}</td>
                        <td>${{toCur(cur.purchasePrice)}}</td>
                        <td>${{toCur(cur.currentPrice)}}</td>
                        <td>${{toCur(cur.profit)}}</td>
                        <td>{{cur.inc}}%</td>
                        <td>
                            <button class="btn btn-sm btn-primary">Update</button>
                            <button class="btn btn-sm btn-danger">Delete</button>
                        </td>
                    </tr>

                    <tr class="total">
                        <td>-</td>
                        <td>TOTAL</td>
                        <td>${{ toCur(profile.summary.totalSpent) }}</td>
                        <td>${{ toCur(profile.summary.totalValue) }}</td>
                        <td>${{ toCur(profile.summary.totalProfit) }}</td>
                        <td>{{ profile.summary.totalIncrease }}%</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>

<script>
    import ProfileValue from './components/profile-value.vue'
    import CurrencyCard from './components/currency-card.vue'

    export default {
        components: {ProfileValue, CurrencyCard},
        data() {
            return {
                profile: {
                    summary: {
                        totalSpent: 0.9,
                        totalValue: 990,
                        totalProfit: 123,
                        totalIncrease: 0.9
                    },
                    investments: [
                        {
                            symbol: "BTC",
                            name: "Bitcoin",
                            purchasePrice: 0.7,
                            currentPrice: 12000.00,
                            profit: 0,
                            inc: 0.9
                        },
                    ]
                },
            }
        },
        methods: {
            toCur(val) {
                return val.toLocaleString()
            }
        }
    }
</script>