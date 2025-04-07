<script setup>
import AdminNavbar from "./component/AdminNavbar.vue";
import AdminFooter from "./component/AdminFooter.vue";
import AdminHeader from "./component/AdminHeader.vue";
</script>

<template>
  <div class="layout-container d-flex min-vh-100">
    <AdminNavbar />
    <!-- 여기에 d-flex 추가 -->
    <div class="d-flex flex-column flex-grow-1">
      <AdminHeader />
      <router-view class="flex-grow-1" />
      <AdminFooter />
    </div>
  </div>
</template>


<style scoped>
.layout-container {
  margin: 0;
  padding: 0;
}
</style>
