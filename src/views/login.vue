<template>
    <div class="row justify-content-center">
        <div class="col-4">
            <h2 class="text-center">Login</h2>
            <form @submit.prevent="login">
                <div class="form-group">
                    <input class="form-control" type="email" placeholder="Enter your email address" v-model="email"
                           v-validate="'required|email'" ref="focusOnMe" autocorrect="off" autocapitalize="off"
                           spellcheck="false"/>
                </div>
                <div class="form-group">
                    <input class="form-control" type="password" name="password" placeholder="Enter your password"
                           v-model="password" v-validate="'required'" autocorrect="off" autocapitalize="off"
                           spellcheck="false"/>
                </div>

                <div class="form-group">
                    <button class="btn btn-primary" :disabled="!this.ready">Login</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                email: '',
                password: ''
            }
        },
        computed: {
            ready() {
                return (this.email.length > 1) && (this.password.length > 1);
            }
        },
        methods: {

            /**
             * Clears input fields
             */
            clearLogin() {
                this.password = '';
            },

            /**
             * when ok is clicked by the user the hide function is triggered
             */
            login() {

                // If we have an error don't make the auth
                if (this.errors.length >= 1)
                    return;

                window.axios.post('/auth/login', {email: this.email, password: this.password})
                    .then((resp) => {
                        this.$store.commit('setUser', resp.data);
                        this.$router.push('/dashboard');
                    })
                    .catch((e) => {

                        console.log(e);

                        // Clear login box
                        this.clearLogin();

                        this.$toasted.error(((e && e.response && e.response.data && e.response.data.message) ? e.response.data.message : 'Sorry something went wrong.'));

                    });

            }

        },

        /**
         * Displays Modal on load of page
         */
        mounted() {

            if (this.$store.getters.getToken) //If valid token - redirect
                this.$router.push('/dashboard');

            // Focus on mount
            this.$refs.focusOnMe.focus();

        }
    }
</script>
