import Main from "../common/Main.vue";
import {createRouter, createWebHistory} from "vue-router";

const routes = [
    { path: '/', component: Main },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;