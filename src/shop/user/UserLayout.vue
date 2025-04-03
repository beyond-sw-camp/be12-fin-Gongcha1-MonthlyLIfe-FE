<script setup>

import UserNavbar from "./component/UserNavbar.vue";
</script>

<template>
    <div class="container-fluid d-flex" style="min-width: 1200px;">
      <UserNavbar></UserNavbar>
      <div class="content">
        <router-view></router-view>

      </div>
    </div>
</template>

<style scoped>
.content {
  padding: 20px;
  width: 100%;
}
</style>