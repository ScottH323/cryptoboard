<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<style lang="stylus">
    @import "styles/styles.styl"
</style>

<script>

    export default {
        components: {},
        data() {
            return {
                //
            }
        },
        beforeMount() {
            this.addNavbarItems();
        },
        methods: {

            /**
             * Add the navbar items
             */
            addNavbarItems() {

                this.left = [
                    {}
                ];

                /**
                 * Demo for navbar
                 */
                this.right = [
                    {
                        name: 'Logout',
                        url: '/logout',
                        icon: 'icon-logout'
                    }
                ]

            }

        }
    }
</script>
