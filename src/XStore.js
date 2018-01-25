import Vue from 'vue'
import Vuex from 'vuex'
import jwtDecode from 'jwt-decode';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        token: null,
        user: null,
        savedData: false,
        currencyTracker: null,
        dashboard: null,
    },
    getters: {
        getUser: state => {
            if (!state.user) {
                console.log('Using cached User');
                state.user = JSON.parse(localStorage.getItem("user"));
            }

            return state.user;
        },

        checkToken: state => {
            if (!state.token)
                return false;

            //Check its valid
            const tsNow   = Math.floor(Date.now() / 1000);
            const decoded = jwtDecode(state.token);

            console.log(state.token);
            console.log(decoded);
            console.log(`${decoded.exp} > ${tsNow}`);

            //If token is still valid then set token
            if (decoded.exp > tsNow) {
                window.axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`; //Set auth token
                return true;
            }

            return false;
        },

        getToken: state => {
            if (!state.token) {
                console.log('Using cached token');
                state.token = JSON.parse(localStorage.getItem("token"));
            }

            return state.token;
        },

        getCurrency: state => {
            if (!state.currencyTracker) {
                console.log('Using cached currency');
                state.currencyTracker = JSON.parse(localStorage.getItem("latestCurrency"));
            }

            return state.currencyTracker;
        },

        getDashboard: state => {
            if (!state.dashboard) {
                console.log('Using cached dashboard');
                state.dashboard = JSON.parse(localStorage.getItem("dashboard"));
            }

            return state.dashboard;
        }
    },
    mutations: {
        updateCurrency: (state, data) => {
            state.currencyTracker = data;
            localStorage.setItem("latestCurrency", JSON.stringify(state.currencyTracker))
        },

        updateDashboard: (state, data) => {
            state.dashboard = data;
            localStorage.setItem("dashboard", JSON.stringify(state.dashboard))
        },

        /**
         * Sets up the user and token values, also sets axios headers with jwt
         * @param state
         * @param data
         */
        setUser: (state, data) => {
            state.user  = data.user;
            state.token = data.token;

            window.axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`; //Set auth token

            localStorage.setItem('token', JSON.stringify(state.token));
            localStorage.setItem('user', JSON.stringify(state.user));
        },
    },
    actions: {
        //
    }

});

export default store;
