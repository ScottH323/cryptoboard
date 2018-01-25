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

window.Vue       = Vue;
window.VueRouter = VueRouter;

window.axios = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1000,
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


router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const res = store.getters.checkToken;
        console.log(`Token Valid: ${res}`);

        if (!res) {
            console.log('Invalid Token!');

            next({
                path: '/login',
                query: {redirect: to.fullPath}
            });
        } else {
            next();
        }
    } else {
        next();
    }
});

window.router = router;
