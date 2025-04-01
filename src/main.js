import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/index.js";
import {createPinia} from "pinia";
import axios from "axios";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
const app = createApp(App);
app.provide('$axios', axios);
app.use(pinia);
app.use(router);
app.mount('#app');