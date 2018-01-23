<script>
    import {Line} from 'vue-chartjs'

    export default {
        extends: Line,
        props: ['options'],

        data() {
            return {
                datacollection: {
                    labels: ['January', 'February'],
                    datasets: [
                        {
                            label: 'Data One',
                            backgroundColor: '#29d2f8',
                            data: [40, 20]
                        }
                    ]
                }
            }
        },

        mounted() {
            this.renderChart(this.datacollection, {
                responsive: true,
                maintainAspectRatio:false,
            })
        }
    }
</script>