<template>
</template>

<script>
    export default {
        mounted() {
            //TODO Logout

            window.axios.get("/auth/logout")
                .then(() => {
                    console.log('done !!');

                    // Redirect page to logon page
                    this.$router.push('/');

                });
        }
    }
</script>
