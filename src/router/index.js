// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Edit from '../views/Edit.vue';
import History from '../views/History.vue';
import Settings from '../views/Settings.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import NotFound from '../views/404.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/edit',
        name: 'Edit',
        component: Edit,
    },
    {
        path: '/history',
        name: 'History',
        component: History,
    },
    {
        path: '/settings',
        name: 'Settings',
        component: Settings,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/404',
        name: 'NotFound',
        component: NotFound,
    },
    {
        path: '/:catchAll(.*)',
        name: 'NotFound',
        component: NotFound,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;