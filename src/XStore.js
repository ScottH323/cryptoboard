import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        settingsData: false
    },
    getters: {},
    mutations: {
        UpdateDashboardData: (state, data) => {
            state.savedData = data

        }

    },
    actions: {
        fetchData(context) {
            window.axios.get('/dashboard').then((resp) => {
                context.commit('UpdateDashboardData', resp.data);
            }, (error) => {
                console.log('error')
            });


        }
    }

});

export default store;
