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
            <div class="col-12">
                <table class="table table-responsive">
                    <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Buy Price</th>
                        <th>Volume</th>
                        <th>Profit</th>
                        <th>Inc.</th>
                        <th>Options</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="i in profile.investments">
                        <td>{{ i.symbol }}</td>
                        <td>${{ toCur(i.buy_price) }}</td>
                        <td>{{ i.amount }}</td>
                        <td>${{ toCur(0) }}</td>
                        <td>{{ 0 }}%</td>
                        <td>
                            <button class="btn btn-sm btn-primary">Update</button>
                            <button class="btn btn-sm btn-danger">Delete</button>
                        </td>
                    </tr>

                    <tr class="total">
                        <td>-</td>
                        <td>TOTAL</td>
                        <td>${{ toCur(summary.totalSpent) }}</td>
                        <td>${{ toCur(summary.totalValue) }}</td>
                        <td>${{ toCur(summary.totalProfit) }}</td>
                        <td>{{ summary.totalIncrease }}%</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>

<script>
    import ProfileValue from './components/profile-value.vue'

    export default {
        components: {ProfileValue},
        data() {
            return {
                apiWorker: null,
                summary: {
                    totalSpent: 0.9,
                    totalValue: 990,
                    totalProfit: 123,
                    totalIncrease: 0.9
                },
                profile: {
                    id: 0,
                    investments: []
                },
            }
        },
        methods: {
            toCur(val) {
                return val.toLocaleString()
            },
            getInvestments() {
                window.axios.get(`/profiles/${this.$store.getters.getUser.id}/investments`).then((resp) => {
                    console.log(resp.data);
                    this.profile = resp.data.profile;
                });
            }
        },
        beforeMount() {
            this.getInvestments();
        }
    }
</script>