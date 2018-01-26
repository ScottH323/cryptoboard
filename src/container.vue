<template>
    <div class="container">
        <nav-bar></nav-bar>
        <div class="row flex-xl-nowrap">
            <main class="col-12" role="main">
                <router-view></router-view>
            </main>
        </div>
    </div>
</template>

<style lang="stylus">
    @import "styles/styles.styl"
</style>

<script>
    import NavBar from "./views/components/nav-bar.vue"

    export default {
        components: {
            NavBar
        },
        data() {
            return {
                //
            }
        },
        beforeMount() {
            //
        },
        methods: {
            //
        }
    }
</script>
