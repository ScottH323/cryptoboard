import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        token: null,
        user: null,
        savedData: false,
        currencyTracker: {}
    },
    getters: {
        getUser: state => {
            if (!state.user)
                state.user = JSON.parse(localStorage.getItem("user"));

            return state.user;
        },

        getToken: state => {
            if (!state.token)
                state.token = JSON.parse(localStorage.getItem("token"));

            return state.token;
        }
    },
    mutations: {
        updateDashboard: (state, data) => {
            state.savedData = data
        },

        updateCurrency: (state, data) => {
            state.currencyTracker = data
        },

        setUser: (state, data) => {
            state.user  = data.user;
            state.token = data.token;

            localStorage.setItem('token', JSON.stringify(state.token));
            localStorage.setItem('user', JSON.stringify(state.user));
        },
    },
    actions: {
        //
    }

});

export default store;
