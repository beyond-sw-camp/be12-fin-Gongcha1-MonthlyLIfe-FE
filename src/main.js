import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/index.js";
import {createPinia} from "pinia";
import axios from "axios";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
 // ✅ 기본 CSS 추가
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ 기본 CSS 추가

import {
    faCartShopping,
    faRotateRight,
    faUser,
    faWonSign,
    faComments,
    faQ,
    faTableColumns,
    faBoxOpen,
    faClipboardCheck,
    faChartSimple,
    faGlobe,
    faHeadset,
    faWallet,
    faShoppingCart,
    faTruck,
    faBox,
    faAngleLeft,
    faAngleRight,
    faMagnifyingGlass,
    faX,
} from '@fortawesome/free-solid-svg-icons'
import {
    faFacebook,
    faSquareInstagram,
    faYoutube,
    faGithub
} from '@fortawesome/free-brands-svg-icons'

library.add(
    faCartShopping,
    faRotateRight,
    faMagnifyingGlass,
    faUser,
    faWonSign,
    faComments,
    faQ,
    faTableColumns,
    faBoxOpen,
    faClipboardCheck,
    faChartSimple,
    faGlobe,
    faHeadset,
    faWallet,
    faShoppingCart,
    faTruck,
    faBox,
    faAngleLeft,
    faAngleRight,
    faX,
    faFacebook,
    faSquareInstagram,
    faYoutube,
    faGithub
)


const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
const app = createApp(App);
app.provide('$axios', axios);
app.use(pinia);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');