<script setup>
import Navbar from './shop/common/component/Navbar.vue';
import AdminNavbar from "./admin/common/component/AdminNavbar.vue";
import {useRoute} from "vue-router";
import AdminFooter from "./admin/common/component/AdminFooter.vue";

const route = useRoute();
</script>

<template>
  <AdminNavbar v-if="route.path.includes('Admin')"></AdminNavbar>
  <Navbar v-else></Navbar>
  <router-view></router-view>
  <AdminFooter v-if="route.path.includes('Admin')"></AdminFooter>
  <Footer v-else></Footer>
</template>

<style scoped>
</style>
