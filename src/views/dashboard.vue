<style>
    .total {
        font-weight: bold;
    }
</style>

<template>
    <section class="dashboard">
        <h1>Dashboard</h1>
        <hr>
        <div class="row">
            <div class="col-12">
                <!-- Graph Here -->
                <profile-value></profile-value>
            </div>
        </div>

        <hr>
        <div class="row">
            <div class="col-md-8 col-sm-12">
                <h3>Investments</h3>
                <investments></investments>
            </div>
            <div class="col-md-4 col-sm-12">
                <h3>New Investment</h3>
                <create-investment></create-investment>
            </div>
        </div>
    </section>
</template>

<script>
    import ProfileValue from './components/profile-value.vue'
    import Investments from './components/investments.vue'
    import CreateInvestment from './components/create-investment.vue'

    export default {
        components: {ProfileValue, Investments, CreateInvestment},
        data() {
            return {
                //
            }
        },
        computed: {
            //
        },
        methods: {
            //
        },
        beforeMount() {
            //
        }
    }
</script>