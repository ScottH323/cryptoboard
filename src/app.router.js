'use strict';

import VueRouter from 'vue-router';

/**
 * Routes
 */
export default new VueRouter({
    mode: 'history',
    linkActiveClass: 'is-active',
    routes: [
        {
            meta: {requiresAuth: false},
            name: 'Login',
            path: '/login',
            component: require('./views/login.vue')
        },
        {
            meta: {requiresAuth: false},
            path: '/',
            redirect: '/login'
        },
        {
            meta: {requiresAuth: false},
            name: 'Logout',
            path: '/logout',
            component: require('./views/logout.vue')
        },
        {
            meta: {requiresAuth: true},
            name: 'Dashboard',
            path: '/dashboard',
            component: require('./views/dashboard.vue')
        },
        {
            name: '404',
            meta: {requiresAuth: false},
            path: '*',
            component: require('./views/404.vue')
        },
    ]
});
