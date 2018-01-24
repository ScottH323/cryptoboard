import Vue from 'vue';
import VueRouter from 'vue-router';
import BootstrapVue from 'bootstrap-vue';
import axios from 'axios';
import VeeValidate from 'vee-validate';
import VueSweetAlert from 'vue-sweetalert'
import Toasted from 'vue-toasted'
import Helper from './Helper';
import store from './XStore';
import router from './app.router';
import VueCharts from 'vue-chartjs';
import Worker from './workers/currency.worker';

window.Vue       = Vue;
window.VueRouter = VueRouter;

window.axios = axios.create({
    baseURL: 'http://localhost:3000', //TODO move to env
    timeout: 1000,
    headers: {
        Authorization: `Bearer ${store.getters.getToken}`
    },
});

window.EventBus = new window.Vue();
window.Helper   = Helper;
window.store    = store;


// Use the VueRouter
Vue.use(VueRouter);

// Use the validation
Vue.use(VeeValidate);

Vue.use(BootstrapVue);

Vue.use(VueSweetAlert);

Vue.use(Toasted, {duration: (2.5 * 1000)});

Vue.use(VueCharts);

window.router = router;

const worker = new Worker();

//start worker
worker.postMessage({start: true});

/**
 * Message will return our crypto array to push over to the store
 * @param event
 */
worker.onmessage = function (event) {
    console.log(event);
    store.commit('updateCurrency', event.data);
};
