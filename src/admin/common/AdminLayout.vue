<script setup>

import AdminNavbar from "./component/AdminNavbar.vue";
import AdminFooter from "./component/AdminFooter.vue";
</script>

<template>
  <AdminNavbar></AdminNavbar>
  <router-view></router-view>
  <AdminFooter></AdminFooter>
</template>

<style scoped>

</style>