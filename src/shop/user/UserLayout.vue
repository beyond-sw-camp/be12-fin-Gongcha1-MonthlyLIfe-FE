<script setup>

import UserNavbar from "./component/UserNavbar.vue";
</script>

<template>
    <div class="container-fluid">
      <UserNavbar></UserNavbar>
      <div class="content">
        <router-view></router-view>

      </div>
    </div>
</template>

<style scoped>
.content {
  margin-left: 350px; /* 사이드바 공간 확보 */
  padding: 20px;
  width: 100%;
}
</style>