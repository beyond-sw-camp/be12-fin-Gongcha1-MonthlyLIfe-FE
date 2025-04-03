<script setup>
import Navbar from './shop/common/component/Navbar.vue';
import AdminNavbar from "./admin/common/component/AdminNavbar.vue";
import {useRoute} from "vue-router";
import AdminFooter from "./admin/common/component/AdminFooter.vue";

const route = useRoute();
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>
</style>
