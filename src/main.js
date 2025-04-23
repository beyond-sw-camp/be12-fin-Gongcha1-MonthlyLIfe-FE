import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/index.js";
import {createPinia} from "pinia";
import axios from "axios";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ 기본 CSS 추가
import 'bootstrap';

library.add(fas);
library.add(far);
library.add(fab);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
const app = createApp(App);
app.provide('$axios', axios);
app.use(pinia);
app.use(router);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');