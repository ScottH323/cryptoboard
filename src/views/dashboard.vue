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
            <div class="col-sm-12">
                <h3>Investments
                    <small>
                        <b-btn v-b-modal.modal-center class="btn btn-sm btn-primary float-right">New Investment</b-btn>
                    </small>
                </h3>
                <investments></investments>
            </div>
        </div>

        <b-modal id="modal-center" centered title="New Investment">
            <create-investment></create-investment>
        </b-modal>
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