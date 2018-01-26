<script>
    import {Line, mixins} from 'vue-chartjs'

    export default {
        extends: Line,
        mixins: [mixins.reactiveProp],
        props: ['chartData'],

        mounted() {
            console.log(this.chartData);
            this.renderChart(this.chartData, {
                responsive: true,
                maintainAspectRatio: false,
            })
        }
    }
</script>