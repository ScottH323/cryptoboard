<template>
</template>

<script>
    export default {
        mounted() {
            this.$store.commit('logout');
            this.$router.push('/');
        }
    }
</script>
