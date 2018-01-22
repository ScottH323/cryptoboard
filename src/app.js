'use strict';

/**
 * Bootstrap our application
 */
import './bootstrap';

import Container from './container.vue';

const router = window.router;

/**
 * Our app
 */
new Vue({
    router,
    render(h) {
        return h(Container);
    },
    store: window.store
}).$mount('#app');

