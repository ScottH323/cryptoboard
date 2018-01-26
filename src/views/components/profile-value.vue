<template>
    <profile-chart :height="100" :chart-data="datacollection"></profile-chart>
</template>

<script>
    import ProfileChart from './profile-chart.vue';

    export default {
        components: {ProfileChart},

        data() {
            return {
                valHist: [],
                invHist: [],
                labels: [],

                datacollection: {}
            }
        },

        methods: {
            getChartData() {
                window.axios.get(`/profiles/${this.$store.getters.getUser.id}/history`).then((resp) => {
                    this.valHist = [];
                    this.invHist = [];
                    for (let h of resp.data.profile.history) {
                        this.valHist.push(h.total_profit);
                        this.invHist.push(h.total_investment);

                        this.labels.push(h.created_at)
                    }

                    this.datacollection = {
                        labels: this.labels,
                        datasets: [
                            {
                                label: 'Portfolio Value',
                                backgroundColor: '#29d2f8',
                                borderColor: '#29d2f8',
                                fill: false,
                                data: this.valHist
                            },
                            {
                                label: 'Total Investment',
                                backgroundColor: '#f8973c',
                                borderColor: '#f8973c',
                                fill: false,
                                data: this.invHist
                            }
                        ]
                    }
                });
            }
        },

        beforeMount() {
            this.getChartData();
        },
    }
</script>